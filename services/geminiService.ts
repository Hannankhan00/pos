import { GoogleGenAI } from "@google/genai";
import type { Order, StockItem, MenuItem } from '../types';

// Helper function to safely initialize the AI client only when needed
const getAIClient = () => {
    if (process.env.API_KEY) {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    console.warn("API_KEY environment variable not set. AI features are disabled.");
    return null;
};

export const getBusinessInsights = async (orders: Order[], menuItems: MenuItem[]): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "AI features disabled. Please set your API key in the deployment environment.";
    
    const prompt = `
        Analyze the following restaurant sales data for today and provide a brief, actionable summary in markdown format. 
        Focus on:
        1.  **Top 3 Selling Items**: List them and suggest why they might be popular.
        2.  **Sales Peak Times**: Identify when most orders were placed.
        3.  **Potential Improvements**: Suggest one data-driven improvement (e.g., a combo deal, a promotion during slow hours).

        **Data:**
        - Orders: ${JSON.stringify(orders.map(o => ({ status: o.status, total: o.total, createdAt: o.createdAt, items: o.items.length })))}
        - Menu: ${JSON.stringify(menuItems.map(m => ({ name: m.name, price: m.price })))}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating business insights:", error);
        return "Could not generate AI insights. Please check the API key and network connection.";
    }
};

export const getMenuDescription = async (itemName: string, category: string): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "";
    
    const prompt = `Write a short, delicious, and appetizing menu description for a dish named "${itemName}" in the "${category}" category. The description should be one sentence and no more than 20 words.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.replace(/"/g, ''); // Remove quotes from response
    } catch (error) {
        console.error("Error generating menu description:", error);
        return "Failed to generate description.";
    }
};

export const getReorderSuggestions = async (stock: StockItem[], orders: Order[]): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "AI features disabled.";

    const prompt = `
        Based on the current inventory levels and a summary of recent sales, create a prioritized reorder list in markdown format.
        - Identify items that are below their low stock threshold.
        - Suggest a reorder quantity based on consumption patterns.
        - Only list items that need reordering. If all stock is fine, state that.

        **Current Inventory:** ${JSON.stringify(stock)}
        **Recent Orders Summary:** ${orders.length} orders placed recently.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating reorder suggestions:", error);
        return "Failed to generate reorder suggestions.";
    }
};

export const getOrderSuggestion = async (currentOrderItems: MenuItem[]): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "AI features disabled.";

    const prompt = `A customer has the following items in their order: ${currentOrderItems.map(i => i.name).join(', ')}. 
    Suggest one complementary item (an appetizer, drink, or dessert) to enhance their meal.
    Provide the suggestion in the format: "You might also enjoy our [Item Name] to go with your meal."
    Be brief and direct.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating order suggestion:", error);
        return "Could not generate suggestion.";
    }
};
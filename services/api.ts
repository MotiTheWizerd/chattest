export const chatService = {
  async sendMessage(
    message: string,
    systemInstruction: string,
    temperature: number
  ) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, systemInstruction, temperature }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response;
  },
};

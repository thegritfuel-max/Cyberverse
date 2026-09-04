import axios from 'axios';

export interface NvidiaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const getNvidiaResponse = async (messages: NvidiaMessage[], model = "google/gemma-4-31b-it") => {
  try {
    const savedKeys = localStorage.getItem('founder_os_keys');
    let userApiKey = "";
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      if (keys.nvidia) userApiKey = keys.nvidia;
    }

    const response = await axios.post('/api/nvidia/chat', {
      messages,
      model,
      stream: false
    }, {
      headers: userApiKey ? { 'x-nvidia-api-key': userApiKey } : {}
    });

    return response.data;
  } catch (error: any) {
    console.error("NVIDIA Service Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to get response from NVIDIA AI");
  }
};

export const getNvidiaResponseStream = async (messages: NvidiaMessage[], model = "google/gemma-4-31b-it") => {
  try {
    const savedKeys = localStorage.getItem('founder_os_keys');
    let userApiKey = "";
    if (savedKeys) {
      const keys = JSON.parse(savedKeys);
      if (keys.nvidia) userApiKey = keys.nvidia;
    }

    const response = await fetch('/api/nvidia/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userApiKey ? { 'x-nvidia-api-key': userApiKey } : {})
      },
      body: JSON.stringify({
        messages,
        model,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch from NVIDIA API');
    }

    return response.body; // ReadableStream
  } catch (error: any) {
    console.error("NVIDIA Stream Error:", error.message);
    throw error;
  }
};

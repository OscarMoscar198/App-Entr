class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get(endpoint: string): Promise<any> {
    try {
      console.log(`GET request to ${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error(`GET request failed with status ${response.status}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("GET response data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  }

  async post(endpoint: string, data: any): Promise<any> {
    try {
      console.log(`POST request to ${this.baseURL}${endpoint} with data:`, data);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error(`POST request failed with status ${response.status}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const responseData = await response.json();
      console.log("POST response data:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error posting data: ", error);
      throw error;
    }
  }
}

export default ApiService;

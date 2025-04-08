import axios from 'axios';
import { log } from './vite';

// Base URL for AdonisJS API
const ADONIS_BASE_URL = 'http://localhost:3333/api';

/**
 * Bridge class to handle communication with AdonisJS API
 */
export class AdonisBridge {
  private baseUrl: string;

  constructor(baseUrl = ADONIS_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to the AdonisJS API
   */
  async request(method: string, path: string, data?: any) {
    try {
      const url = `${this.baseUrl}${path}`;
      log(`Adonis bridge request: ${method} ${url}`, 'adonis-bridge');
      
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error: any) {
      log(`Adonis bridge error: ${error.message}`, 'adonis-bridge');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw {
          status: error.response.status,
          message: error.response.data.message || 'AdonisJS server error',
          errors: error.response.data.errors
        };
      } else if (error.request) {
        // The request was made but no response was received
        throw {
          status: 503,
          message: 'AdonisJS server unavailable'
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        throw {
          status: 500,
          message: error.message
        };
      }
    }
  }
}

// Export a singleton instance
export const adonisBridge = new AdonisBridge();
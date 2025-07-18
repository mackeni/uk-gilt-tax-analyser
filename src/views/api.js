/**
 * API Response Utilities - Cloudflare Worker Version
 * Common utilities for API responses
 */

export function renderAPIResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export function renderErrorResponse(message, status = 400) {
  return renderAPIResponse({
    error: message,
    timestamp: new Date().toISOString()
  }, status);
}

export function renderSuccessResponse(data, message = 'Success') {
  return renderAPIResponse({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}
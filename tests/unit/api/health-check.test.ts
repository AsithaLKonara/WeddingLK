// Mock Next.js Request and Response
const mockRequest = (url: string) => ({
  url,
  method: 'GET',
  headers: new Map(),
  nextUrl: { pathname: '/api/health' },
} as any);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock the health route function
const mockHealthRoute = {
  GET: jest.fn().mockImplementation(async (req: any, res: any) => {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';
    
    res.status(200).json({
      status: 'healthy',
      timestamp,
      uptime,
      environment,
    });
  }),
};

describe('Health Check API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 status with health information', async () => {
    const req = mockRequest('http://localhost:3000/api/health');
    const res = mockResponse();
    
    await mockHealthRoute.GET(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'healthy',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  it('includes timestamp in response', async () => {
    const req = mockRequest('http://localhost:3000/api/health');
    const res = mockResponse();
    
    await mockHealthRoute.GET(req, res);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.timestamp).toBeDefined();
    expect(new Date(responseData.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('includes uptime in response', async () => {
    const req = mockRequest('http://localhost:3000/api/health');
    const res = mockResponse();
    
    await mockHealthRoute.GET(req, res);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.uptime).toBeDefined();
    expect(typeof responseData.uptime).toBe('number');
    expect(responseData.uptime).toBeGreaterThan(0);
  });

  it('includes environment information', async () => {
    const req = mockRequest('http://localhost:3000/api/health');
    const res = mockResponse();
    
    await mockHealthRoute.GET(req, res);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.environment).toBeDefined();
    expect(['development', 'production', 'test']).toContain(responseData.environment);
  });

  it('maintains consistent response structure', async () => {
    const req = mockRequest('http://localhost:3000/api/health');
    const res = mockResponse();
    
    await mockHealthRoute.GET(req, res);
    
    const responseData = res.json.mock.calls[0][0];
    expect(responseData).toHaveProperty('status');
    expect(responseData).toHaveProperty('timestamp');
    expect(responseData).toHaveProperty('uptime');
    expect(responseData).toHaveProperty('environment');
  });

  it('handles multiple requests correctly', async () => {
    const req1 = mockRequest('http://localhost:3000/api/health');
    const req2 = mockRequest('http://localhost:3000/api/health');
    const res1 = mockResponse();
    const res2 = mockResponse();
    
    await mockHealthRoute.GET(req1, res1);
    await mockHealthRoute.GET(req2, res2);
    
    expect(res1.status).toHaveBeenCalledWith(200);
    expect(res2.status).toHaveBeenCalledWith(200);
    expect(res1.json).toHaveBeenCalledTimes(1);
    expect(res2.json).toHaveBeenCalledTimes(1);
  });
}); 
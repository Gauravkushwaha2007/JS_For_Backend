const rateLimitMap = new Map();

/**
 * Lightweight, zero-dependency in-memory rate limiter middleware.
 * @param {Object} options Configuration parameters.
 * @param {number} options.windowMs Time window in milliseconds (default: 15 minutes).
 * @param {number} options.max Maximum requests per window (default: 100).
 * @param {string} options.message Error message to display when limit is reached.
 */
const rateLimiter = (options = {}) => {
    const windowMs = options.windowMs || 15 * 60 * 1000; 
    const maxRequests = options.max || 100; 
    const message = options.message || "Aap bahut zyaada requests kar rahe hain. Kripya thodi der baad koshish karein.";

    // Periodically clean up expired IPs to prevent memory leaks
    setInterval(() => {
        const now = Date.now();
        for (const [ip, timestamps] of rateLimitMap.entries()) {
            const active = timestamps.filter(t => now - t < windowMs);
            if (active.length === 0) {
                rateLimitMap.delete(ip);
            } else {
                rateLimitMap.set(ip, active);
            }
        }
    }, 60000); // run cleanup every 1 minute

    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const now = Date.now();

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, []);
        }

        let requests = rateLimitMap.get(ip);
        // Filter out timestamps older than the window
        requests = requests.filter(timestamp => now - timestamp < windowMs);

        if (requests.length >= maxRequests) {
            // Check if it is a JSON or AJAX request
            if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
                return res.status(429).json({ success: false, message });
            }
            return res.status(429).render('error', {
                status: 429,
                message: "Too Many Requests",
                detail: message,
                buttonText: "Go Back Home",
                buttonLink: "/"
            });
        }

        requests.push(now);
        rateLimitMap.set(ip, requests);
        next();
    };
};

module.exports = rateLimiter;

export interface NormalizedUrlResult {
  isValid: boolean;
  rawInput: string;
  normalizedUrl?: string;
  protocol?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  isIpHostname?: boolean;
  isPunycode?: boolean;
  error?: string;
}

/**
 * Validates, normalizes, and inspects a user-submitted URL string safely.
 * Never performs network requests or resolves DNS.
 */
export function validateAndNormalizeUrl(input: string): NormalizedUrlResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, rawInput: input, error: "Input URL cannot be empty." };
  }

  if (trimmed.length > 2048) {
    return { isValid: false, rawInput: input, error: "URL exceeds maximum allowed length of 2048 characters." };
  }

  // Check for explicitly dangerous or unsupported schemes
  const lowerInput = trimmed.toLowerCase();
  const unsupportedSchemes = ["javascript:", "data:", "file:", "ftp:", "blob:", "vbscript:", "about:"];
  for (const scheme of unsupportedSchemes) {
    if (lowerInput.startsWith(scheme)) {
      return {
        isValid: false,
        rawInput: input,
        error: `Unsupported or unsafe protocol scheme (${scheme.replace(":", "")}). Only HTTP and HTTPS are analyzed.`
      };
    }
  }

  // Prepend https:// if bare domain / hostname without scheme
  let candidateUrl = trimmed;
  if (!/^https?:\/\//i.test(candidateUrl)) {
    // Ensure it doesn't look like a local filename or generic text without dot
    if (candidateUrl.includes(".") && !candidateUrl.startsWith("//")) {
      candidateUrl = "https://" + candidateUrl;
    } else {
      return {
        isValid: false,
        rawInput: input,
        error: "Invalid domain or URL format. Must contain a valid hostname."
      };
    }
  }

  // Reject embedded username/password credentials (e.g. http://admin:secret@domain.com)
  const credentialsRegex = /^https?:\/\/([^/@]+):([^/@]+)@/i;
  const userOnlyRegex = /^https?:\/\/([^/@]+)@/i;
  if (credentialsRegex.test(candidateUrl) || userOnlyRegex.test(candidateUrl)) {
    return {
      isValid: false,
      rawInput: input,
      error: "URLs containing embedded authentication credentials (username:password@) are prohibited for security."
    };
  }

  try {
    const parsed = new URL(candidateUrl);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        isValid: false,
        rawInput: input,
        error: `Only HTTP and HTTPS protocols are allowed. Received: ${parsed.protocol}`
      };
    }

    const hostname = parsed.hostname.toLowerCase();
    
    if (!hostname || hostname === "localhost") {
      return {
        isValid: false,
        rawInput: input,
        error: "Invalid or restricted hostname."
      };
    }

    // IP address detection (IPv4 / IPv6)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^\[?[a-f0-9:]+\]?$/i;
    const isIpHostname = ipv4Regex.test(hostname) || (ipv6Regex.test(hostname) && hostname.includes(":"));

    // Check for Punycode internationalized domain (xn--)
    const isPunycode = hostname.split(".").some(part => part.startsWith("xn--"));

    return {
      isValid: true,
      rawInput: input,
      normalizedUrl: parsed.href,
      protocol: parsed.protocol.replace(":", ""),
      hostname,
      port: parsed.port || (parsed.protocol === "https:" ? "443" : "80"),
      pathname: parsed.pathname,
      search: parsed.search,
      isIpHostname,
      isPunycode
    };
  } catch (err) {
    return {
      isValid: false,
      rawInput: input,
      error: "Malformed URL. Unable to parse hostname or URL structure."
    };
  }
}

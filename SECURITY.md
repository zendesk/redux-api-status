# AI Agent Security Standard

This document defines mandatory security principles and restrictions for all AI coding assistants operating in this repository. All AI agents must follow these requirements without exception.

**Authority:** Derived from [Zendesk Minimum Baseline Security Standard](https://docs.google.com/document/d/17GZ9TpjKCt6WCdw3yxL44Ra_YscbOBVnVkUVGgx5Hz0/) and internal security policies.

---

## Core Security Mandate

Security is a first-class requirement. Every code suggestion must be evaluated against these guidelines. If a request would result in insecure code:

1. **Stop** and flag the security concern
2. **Explain** why it's problematic
3. **Propose** a secure alternative

AI-generated code requires human review before merging.

---

## Absolute Prohibitions

AI agents must **NEVER** do the following:

### Secrets & Credentials
- Hardcode secrets, credentials, API keys, tokens, or passwords in source code
- Store secrets in version control (`.env` files, config with real values)
- Log, print, or expose secret values
- Expose credentials in URLs, logs, or error messages

### Security Controls
- Disable or weaken security controls
- Bypass authentication or authorization checks
- Disable certificate validation

### Dangerous Code Patterns
- Use `eval()` or `exec()` with user-supplied input
- Implement custom cryptography
- Use deprecated algorithms (MD5, SHA-1, DES, RC4, ECB mode)

### Data Exposure
- Log sensitive data (PII, credentials, tokens, customer data)
- Expose stack traces or internal paths to end users
- Transmit sensitive data over unencrypted channels

---

## Required Security Patterns

### npm Publishing
This is a published npm library. Before any release:
- Run `yarn build` to compile output to `lib/` — never publish unbuilt source
- Confirm `lib/` contents do not contain secrets, internal tokens, or environment-specific values
- Review `package.json` dependency changes for supply-chain risk before merging

### Dependency Management

```js
// Correct: pin dependencies in package.json; bump via PR review
"dependencies": { "alexs-redux-helpers": "^2.0.0" }
```

```js
// NEVER: accept dependency changes without review — supply-chain attacks target npm libraries
```

### Input Handling
This library processes user-supplied `ref` strings and promise results. Do not execute or evaluate `ref` values as code.

```js
// Correct: treat ref as a plain string key
const key = getKeyFn(...args);  // string only

// NEVER: eval or execute ref strings
eval(ref);
```

### Error Messages
The `trackStatus` thunk propagates `err.message` as the error payload. Do not enrich error messages with internal paths, stack traces, or sensitive system details.

```js
// Correct: use the error message string only
dispatch(failure(key, { error: err.message }));

// NEVER: expose stack traces or internal details
dispatch(failure(key, { error: err.stack, internals: err }));
```

---

## Security Requirements by Domain

### Dependency Supply Chain
- All dependency additions or upgrades must go through PR review
- Check for known vulnerabilities with `npm audit` or `yarn audit` before releasing
- Do not add transitive dependencies that pull in packages with known CVEs

### Data Protection
- The library never handles PII, credentials, or sensitive application data directly; it only tracks status metadata (strings, timestamps, counts)
- Do not add features that store or transmit actual API response payloads beyond what is already passed to `success(ref, payload)` by the consumer

### Cryptography
| Use Case | Approved | Forbidden |
|----------|----------|-----------|
| Integrity hashing (if ever needed) | SHA-256, SHA-3 | MD5, SHA-1 |
| Symmetric encryption (if ever needed) | AES-256-GCM | DES, 3DES, AES-ECB |

### Communication Security
- This library does not make network requests itself; it wraps consumer-provided promises
- Do not introduce any direct HTTP/fetch calls within the library

---

## When to Stop and Escalate

Stop, explain the concern, and recommend involving Security if a task requires:

- Bypassing or weakening security controls
- Exposing consumer data, tokens, or credentials via library APIs
- Adding network request capabilities to this library
- Accepting or executing untrusted input as code
- Using deprecated cryptographic algorithms
- Publishing a release that contains environment-specific secrets or tokens

---

## Security Testing

When generating features, include:

- Tests verifying that `failure` payloads only carry the error message string, not stack traces
- Tests for edge cases in `ref` handling (empty strings, special characters) to ensure no eval-like behaviour
- Negative test cases confirming no data leakage in error paths

---

## References

- [Minimum Baseline Security Standard](https://docs.google.com/document/d/17GZ9TpjKCt6WCdw3yxL44Ra_YscbOBVnVkUVGgx5Hz0/)
- [Cryptography Standards](https://techmenu.zende.sk/standards/cryptography-standards/)
- [Zendesk npm Publishing Guidelines](https://techmenu.zende.sk/)

---

**Questions?** Reach out to the Security team or file a ticket via the Security Engagement process.

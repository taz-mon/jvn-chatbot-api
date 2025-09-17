# JVN error handling

The JVN Chatbot API uses conventional HTTP response codes to indicate the success or failure of API requests. Errors return both machine-readable error codes and human-readable messages.

## Error response format

All errors return a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "message": "Ze food level must be: snack (1 token), entree (2 tokens), or restaurant (5 tokens)",
    "code": "INVALID_FOOD_LEVEL"
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

## HTTP status codes

| Status | Description |
|---------|-------------|
| `200` | **Success** - The request was successful |
| `400` | **Bad Request** - Invalid request parameters or missing required fields |
| `500` | **Server Error** - Something went wrong on JVN's end |

## Common rrrors

### Token-related errors

#### No tokens available
**Status Code:** `400`  
**Error Code:** `NO_TOKENS_AVAILABLE`

```http
POST /chat/ask-question
```

```json
{
  "success": false,
  "error": {
    "message": "No tokens available! Please inspire JVN to earn tokens first.",
    "code": "NO_TOKENS_AVAILABLE"
  }
}
```

**Resolution:** Use inspiration endpoints (`/inspire/*`) to earn tokens before asking questions.

### Validation errors

#### Invalid Food Level
**Status Code:** `400`  
**Error Code:** `INVALID_FOOD_LEVEL`

```http
POST /inspire/food
Content-Type: application/json

{
  "level": "invalid_option"
}
```

```json
{
  "success": false,
  "error": {
    "message": "Ze food level must be: snack (1 token), entree (2 tokens), or restaurant (5 tokens)",
    "code": "INVALID_FOOD_LEVEL"
  }
}
```

**Resolution:** Use valid food levels: `"snack"`, `"entree"`, or `"restaurant"`.

#### Missing required parameter
**Status Code:** `400`  
**Error Code:** `MISSING_QUESTION`

```http
POST /chat/ask-question
Content-Type: application/json

{}
```

```json
{
  "success": false,
  "error": {
    "message": "Ze question parameter is required for mathematical discourse!",
    "code": "MISSING_QUESTION"
  }
}
```

**Resolution:** Include the `question` field in your request body.

### Feature access errors

#### Birthday Mode Required
**Status Code:** `400`  
**Error Code:** `NOT_BIRTHDAY_MODE`

```http
POST /inspire/birthday-cake
```

```json
{
  "success": false,
  "error": {
    "message": "Birthday kuchen can only be given during birthday celebrations!",
    "code": "NOT_BIRTHDAY_MODE"
  }
}
```

**Resolution:** Birthday cake is only available during JVN's birthday mode (every 1000 questions). Check current status via `GET /chatbot/status`.

## Error codes reference

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `NO_TOKENS_AVAILABLE` | Insufficient tokens for the requested action | Earn tokens through inspiration activities |
| `INVALID_FOOD_LEVEL` | Invalid food level parameter | Use "snack", "entree", or "restaurant" |
| `MISSING_QUESTION` | Required question parameter not provided | Include question in request body |
| `NOT_BIRTHDAY_MODE` | Birthday-only feature accessed outside birthday period | Wait for birthday mode or check status |
| `VALIDATION_ERROR` | Request data failed validation | Review request format against API specification |
| `INTERNAL_SERVER_ERROR` | Unexpected server error | Retry request or contact support |

## Troubleshooting tips

### Checking your token balance
Before asking questions, verify you have sufficient tokens:

```http
GET /chatbot/status
```

### Verifying request format
Ensure your requests match the expected format:

```http
POST /chat/ask-question
Content-Type: application/json

{
  "question": "What is the meaning of mathematics?"
}
```

### Monitor JVN's mood
JVN becomes pickier over time. Check his current mood via `/chatbot/status` to understand response patterns.


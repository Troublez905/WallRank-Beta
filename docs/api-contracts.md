# API Contract Examples

These are starter examples for a Next.js App Router implementation using route handlers.

## `GET /api/spots`

### Query Params

- `city`
- `artist`
- `category`
- `minRating`
- `status`
- `page`

### Example Response

```json
{
  "items": [
    {
      "id": "3c2d685d-2b9c-4b4d-a0fa-7cc7f4178d4d",
      "slug": "king-william-burner",
      "title": "King William Burner",
      "category": "piece",
      "status": "active",
      "avgRating": 4.6,
      "ratingsCount": 18,
      "isFeatured": true,
      "artist": {
        "id": "ac973e9c-cd32-48b0-bdb8-f6265c7bd91d",
        "tagName": "AERO",
        "slug": "aero"
      },
      "location": {
        "name": "King William Wall",
        "city": "Hamilton",
        "latitude": 43.255203,
        "longitude": -79.868202,
        "visibility": "public_approximate"
      },
      "primaryImage": {
        "imageUrl": "https://example.com/image.jpg",
        "thumbnailUrl": "https://example.com/thumb.jpg"
      }
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

## `GET /api/spots/:slug`

### Example Response

```json
{
  "id": "3c2d685d-2b9c-4b4d-a0fa-7cc7f4178d4d",
  "slug": "king-william-burner",
  "title": "King William Burner",
  "description": "Large multicolor burner on a warehouse wall.",
  "category": "piece",
  "status": "active",
  "avgRating": 4.6,
  "ratingsCount": 18,
  "commentsCount": 4,
  "artistPointsTotal": 83,
  "styleTags": ["wildstyle", "colorfade"],
  "artist": {
    "id": "ac973e9c-cd32-48b0-bdb8-f6265c7bd91d",
    "tagName": "AERO",
    "slug": "aero",
    "isVerified": true
  },
  "location": {
    "name": "King William Wall",
    "city": "Hamilton",
    "latitude": 43.255203,
    "longitude": -79.868202,
    "visibility": "public_approximate"
  },
  "images": [],
  "ratingsHistogram": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 4,
    "5": 11
  },
  "comments": []
}
```

## `POST /api/spots/:id/rate`

### Request

```json
{
  "stars": 5
}
```

### Success Response

```json
{
  "ok": true,
  "rating": {
    "stars": 5,
    "artistPointsAwarded": 5,
    "supporterPointsAwarded": 1
  },
  "artwork": {
    "avgRating": 4.7,
    "ratingsCount": 19
  }
}
```

## `POST /api/spots/:id/comments`

### Request

```json
{
  "body": "Fresh color work on this one.",
  "parentCommentId": null
}
```

## `GET /api/leaderboard?type=artist&range=month`

### Example Response

```json
{
  "type": "artist",
  "range": "month",
  "generatedAt": "2026-03-11T10:00:00.000Z",
  "items": [
    {
      "rank": 1,
      "entityId": "ac973e9c-cd32-48b0-bdb8-f6265c7bd91d",
      "name": "AERO",
      "slug": "aero",
      "city": "Hamilton",
      "monthlyPoints": 83,
      "totalPoints": 931,
      "avgRating": 4.62
    }
  ]
}
```

## `PATCH /api/admin/spots/:id`

### Request

```json
{
  "status": "approved",
  "artistId": "ac973e9c-cd32-48b0-bdb8-f6265c7bd91d",
  "isFeatured": false
}
```

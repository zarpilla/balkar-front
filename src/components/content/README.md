# Dynamic Content Components

This system provides a flexible way to render dynamic content from Strapi with different content types.

## New: Quiz Component

### ContentQuiz Component

The ContentQuiz component includes enhanced styling and functionality for displaying interactive quizzes with multiple-choice questions.

#### Key Features

1. **Option Prefixes**: Each quiz option displays with a letter prefix (A), B), C), D))
2. **Custom Radio Buttons**: Uses custom SVG radio buttons that change based on state
3. **Enhanced Answer Display**: Shows correct option with prefix before explanation
4. **Learning Space Integration**: Blocks completion until all questions are answered correctly

#### SVG Icons Used
- `radio-empty.svg`: For unselected options
- `radio-ok.svg`: For correct selections (green)  
- `radio.ko.svg`: For incorrect selections (orange)

## Usage

```vue
<template>
  <SpaceContent :content="contentArray" />
</template>

<script setup>
import SpaceContent from '@/components/SpaceContent.vue'

// Example content structure
const contentArray = [
  {
    "__component": "content.text",
    "id": 6,
    "title": "Why This Course?",
    "text": [
      {
        "type": "paragraph", 
        "children": [
          {
            "text": "Cities are at the forefront of the climate emergency...",
            "type": "text"
          }
        ]
      }
    ]
  }
]
</script>
```

## Supported Content Types

### content.text
Renders rich text content with title and paragraphs.

**Props:**
- `title` (optional): Section title
- `text`: Array of paragraph objects with children text nodes

### content.image
Renders images with optional title and caption.

**Props:**
- `title` (optional): Image title
- `image`: Image object with url and alternativeText
- `caption` (optional): Image caption

### content.video
Renders videos either as direct video files or embedded content.

**Props:**
- `title` (optional): Video title
- `video` (optional): Video file object with url
- `embedUrl` (optional): YouTube/Vimeo embed URL
- `poster` (optional): Video poster image
- `description` (optional): Video description

## Adding New Content Types

1. Create a new component in `/components/content/` (e.g., `ContentQuote.vue`)
2. Add the component to the import statements in `SpaceContent.vue`
3. Add the mapping in the `componentMap` object
4. Export the component in `/components/content/index.ts`

Example for a new quote component:

```typescript
// ContentQuote.vue
<template>
  <blockquote class="content-quote">
    <p class="content-quote__text">{{ data.quote }}</p>
    <cite v-if="data.author" class="content-quote__author">
      {{ data.author }}
    </cite>
  </blockquote>
</template>

<script setup lang="ts">
interface ContentQuoteData {
  __component: string
  id: number
  quote: string
  author?: string
}

interface Props {
  data: ContentQuoteData
}

defineProps<Props>()
</script>
```

Then add to SpaceContent.vue:
```typescript
import ContentQuote from './content/ContentQuote.vue'

const componentMap: Record<string, any> = {
  'content.text': ContentText,
  'content.image': ContentImage,
  'content.video': ContentVideo,
  'content.quote': ContentQuote, // Add new component
}
```

## Content Structure

The system expects content to follow this structure:

```typescript
interface ContentItem {
  __component: string  // Component type identifier
  id: number          // Unique identifier
  [key: string]: any  // Component-specific data
}
```

The `__component` field determines which Vue component will be used to render the content.

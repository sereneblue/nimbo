<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html {
    font-size: 16px;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: #707070 #dbdcdd;
  }

  .dark * {
    scrollbar-color: #a5a8a7 #343537;
  }

  *::-webkit-scrollbar {
    width: 12px;
  }

  *::-webkit-scrollbar-track {
    background: #dbdcdd;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #707070;
    border-radius: 20px;
    border: 3px solid #dbdcdd;
  }

  .dark *::-webkit-scrollbar-track {
    background: #343537;
  }

  .dark *::-webkit-scrollbar-thumb {
    background-color: #a5a8a7;
    border-radius: 20px;
    border: 3px solid #343537;
  }

  .link {
    @apply text-indigo-500 underline font-semibold opacity-100;
  }

  .markdown {
    @apply leading-normal break-words;
  }

  .markdown > * + * {
    @apply mt-0 mb-2;
  }

  .markdown li + li {
    @apply mt-1;
  }

  .markdown li > p + p {
    @apply mt-2;
  }

  .markdown strong {
    @apply font-semibold;
  }

  .markdown strong a {
    @apply font-bold;
  }

  .markdown h1 {
    @apply leading-tight border-b border-indigo-500 text-2xl font-semibold py-2;
  }

  .markdown h2 {
    @apply leading-tight border-b border-indigo-500 text-xl font-semibold py-2;
  }

  .markdown h3 {
    @apply leading-snug text-lg font-semibold py-2;
  }

  .markdown h4 {
    @apply leading-none text-base font-semibold py-2;
  }

  .markdown h5 {
    @apply leading-tight text-sm font-semibold py-2;
  }

  .markdown h6 {
    @apply leading-tight text-sm font-semibold text-gray-600 py-2;
  }

  .markdown blockquote {
    @apply text-base border-l-4 border-indigo-500 px-2 text-gray-600;
  }

  .markdown code {
    @apply font-mono text-sm inline bg-gray-200 rounded px-1 py-0.5;
  }

  .markdown pre {
    @apply bg-gray-100 rounded p-2;
  }

  .markdown pre code {
    @apply block bg-transparent p-0 overflow-visible rounded-none;
  }

  .markdown ul {
    @apply text-base pl-8 list-disc;
  }

  .markdown ol {
    @apply text-base pl-8 list-decimal;
  }

  .markdown kbd {
    @apply text-xs inline-block rounded border px-1 py-0.5 align-middle font-normal font-mono shadow;
  }

  .markdown table {
    @apply text-base border-gray-600;
  }

  .markdown th {
    @apply border py-1 px-3;
  }

  .markdown td {
    @apply border py-1 px-3;
  }

  .markdown .highlight pre {
    @apply bg-gray-100 !important;
  }
</style>
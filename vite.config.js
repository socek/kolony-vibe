import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// build skleja grę w jeden plik dist/index.html, który można otworzyć z dysku
export default defineConfig({
  base: './',
  plugins: [vue(), viteSingleFile()],
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.js', 'tests/components/**/*.test.js']
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// build skleja grę w jeden plik dist/index.html, który można otworzyć z dysku
export default defineConfig({
  base: './',
  plugins: [vue(), viteSingleFile()],
  // npm run dev nasłuchuje na wszystkich interfejsach – grę można otworzyć na telefonie w tej samej sieci (adres „Network”)
  server: { host: true },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.js', 'tests/components/**/*.test.js']
  }
})

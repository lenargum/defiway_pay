import { defineConfig } from 'vite'

// Custom class prefix plugin
function classPrefixPlugin(prefix = 'dwp-') {
  const classMap = new Map();
  
  // Generate prefixed class name
  const getPrefixedClass = (className) => {
    if (!classMap.has(className)) {
      classMap.set(className, `${prefix}${className}`);
    }
    return classMap.get(className);
  };

  return {
    name: 'class-prefix',
    apply: 'build', // Only apply during build
    transformIndexHtml: {
      enforce: 'post',
      transform(html) {
        // Replace class attributes in HTML
        return html.replace(/class="([^"]+)"/g, (match, classes) => {
          const prefixedClasses = classes
            .split(/\s+/)
            .map(cls => cls.trim() ? getPrefixedClass(cls) : cls)
            .join(' ');
          return `class="${prefixedClasses}"`;
        });
      }
    },
    transform(code, id) {
      // Transform JavaScript files
      if (id.endsWith('.js')) {
        // Replace querySelector/querySelectorAll class selectors
        code = code.replace(/(['"`])\.([a-zA-Z][\w-]*)\1/g, (match, quote, className) => {
          return `${quote}.${getPrefixedClass(className)}${quote}`;
        });
        
        // Replace classList operations
        code = code.replace(/classList\.(add|remove|toggle|contains)\(['"`]([^'"`]+)['"`]\)/g, 
          (match, method, className) => {
            return `classList.${method}('${getPrefixedClass(className)}')`;
          }
        );
        
        // Replace getElementById with class alternatives if needed
        code = code.replace(/getElementById\(['"`]([^'"`]+)['"`]\)/g, (match, id) => {
          if (id.includes('-')) { // Likely a class-like ID
            return `querySelector('.${getPrefixedClass(id)}')`;
          }
          return match;
        });
      }
      
      // Transform CSS files
      if (id.endsWith('.css')) {
        code = code.replace(/\.([a-zA-Z][\w-]*)/g, (match, className) => {
          return `.${getPrefixedClass(className)}`;
        });
      }
      
      return code;
    }
  };
}

export default defineConfig({
  root: 'src',
  plugins: [
    classPrefixPlugin('dwp-')
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/index.html'
      }
    },
    assetsDir: 'assets',
    cssCodeSplit: false,
  },
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    open: true,
    port: 3001
  }
})

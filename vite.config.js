import { defineConfig } from 'vite'

// Custom class prefix plugin
function classPrefixPlugin(prefix = 'dwp-', baseUrl = '/') {
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
      transform(html, context) {
        // Replace class attributes in HTML
        html = html.replace(/class="([^"]+)"/g, (match, classes) => {
          const prefixedClasses = classes
            .split(/\s+/)
            .map(cls => cls.trim() ? getPrefixedClass(cls) : cls)
            .join(' ');
          return `class="${prefixedClasses}"`;
        });

        // Transform OG image URLs to include base path for production
        if (context.bundle) {
          // Find the actual OG image asset in the bundle
          const ogImageAsset = Object.keys(context.bundle).find(key => 
            key.includes('og-image') && context.bundle[key].type === 'asset'
          );
          
          if (ogImageAsset) {
            const fullPath = baseUrl + ogImageAsset;
            html = html.replace(
              /content="\.\/assets\/og-image\.png"/g, 
              `content="${fullPath}"`
            );
          }
        }

        return html;
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

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  const baseUrl = isProduction ? '/defiway_pay/' : '/';
  
  return {
    root: 'src',
    base: baseUrl,
    plugins: [
      classPrefixPlugin('dwp-', baseUrl)
    ],
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: 'src/index.html',
          ogImage: 'src/assets/og-image.png'
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
  }
})

// vite.config.js
import { defineConfig } from "file:///C:/Users/raven/Desktop/job/side/rms_front/.yarn/__virtual__/vite-virtual-e4536be618/5/AppData/Local/Yarn/Berry/cache/vite-npm-5.0.7-583fea8b6f-10c0.zip/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/raven/Desktop/job/side/rms_front/.yarn/__virtual__/@vitejs-plugin-react-virtual-17ac000c21/5/AppData/Local/Yarn/Berry/cache/@vitejs-plugin-react-npm-4.2.1-8b9705c544-10c0.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve
} from "file:///C:/Users/raven/Desktop/job/side/rms_front/.yarn/__virtual__/vite-plugin-style-import-virtual-e2f6b85753/5/AppData/Local/Yarn/Berry/cache/vite-plugin-style-import-npm-2.0.0-0ceadf4c65-10c0.zip/node_modules/vite-plugin-style-import/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\raven\\Desktop\\job\\side\\rms_front";
var vite_config_default = defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
        VantResolve(),
        ElementPlusResolve(),
        NutuiResolve(),
        AntdResolve()
      ],
      libs: [
        {
          libraryName: "ant-design-vue",
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          }
        }
      ]
    })
  ],
  //경로 확인
  resolve: {
    alias: {
      src: path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      cache: true,
      // 캐시 설정
      manifest: true,
      /*manifest: 이 옵션을 true로 설정하면, Vite는 빌드 시 manifest.json 파일을 생성합니다. 이 파일은 빌드된 자원(assets)의 목록과 해시된 파일 이름을 포함하고 있어서, 서버 사이드에서 적절한 파일 경로를 참조할 수 있게 도와줍니다.*/
      output: {
        //큰 라이브러리를 쪼개서 만들어준다
        manualChunks: {
          antd: ["antd"],
          react: ["react", "react-dom"],
          reactRouter: ["react-router-dom"],
          axios: ["axios"],
          suneditor: ["suneditor", "suneditor-react"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyYXZlblxcXFxEZXNrdG9wXFxcXGpvYlxcXFxzaWRlXFxcXHJtc19mcm9udFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccmF2ZW5cXFxcRGVza3RvcFxcXFxqb2JcXFxcc2lkZVxcXFxybXNfZnJvbnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3JhdmVuL0Rlc2t0b3Avam9iL3NpZGUvcm1zX2Zyb250L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHtcclxuXHRjcmVhdGVTdHlsZUltcG9ydFBsdWdpbixcclxuXHRBbmREZXNpZ25WdWVSZXNvbHZlLFxyXG5cdFZhbnRSZXNvbHZlLFxyXG5cdEVsZW1lbnRQbHVzUmVzb2x2ZSxcclxuXHROdXR1aVJlc29sdmUsXHJcblx0QW50ZFJlc29sdmVcclxufSBmcm9tICd2aXRlLXBsdWdpbi1zdHlsZS1pbXBvcnQnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cclxuXHRjc3M6IHtcclxuXHRcdHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuXHRcdFx0bGVzczoge1xyXG5cdFx0XHRcdGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdHBsdWdpbnM6IFtcclxuXHRcdHJlYWN0KCksXHJcblx0XHRjcmVhdGVTdHlsZUltcG9ydFBsdWdpbih7XHJcblx0XHRcdHJlc29sdmVzOiBbXHJcblx0XHRcdFx0QW5kRGVzaWduVnVlUmVzb2x2ZSgpLFxyXG5cdFx0XHRcdFZhbnRSZXNvbHZlKCksXHJcblx0XHRcdFx0RWxlbWVudFBsdXNSZXNvbHZlKCksXHJcblx0XHRcdFx0TnV0dWlSZXNvbHZlKCksXHJcblx0XHRcdFx0QW50ZFJlc29sdmUoKSxcclxuXHRcdFx0XSxcclxuXHRcdFx0bGliczogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxpYnJhcnlOYW1lOiAnYW50LWRlc2lnbi12dWUnLFxyXG5cdFx0XHRcdFx0ZXNNb2R1bGU6IHRydWUsXHJcblx0XHRcdFx0XHRyZXNvbHZlU3R5bGU6IChuYW1lKSA9PiB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBgYW50LWRlc2lnbi12dWUvZXMvJHtuYW1lfS9zdHlsZS9pbmRleGBcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XSxcclxuXHRcdH0pLFxyXG5cclxuXHRdLFxyXG5cclxuXHQvL1x1QUNCRFx1Qjg1QyBcdUQ2NTVcdUM3NzhcclxuXHRyZXNvbHZlOiB7XHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHRzcmM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0YnVpbGQ6IHtcclxuXHRcdHJvbGx1cE9wdGlvbnM6IHtcclxuXHRcdFx0Y2FjaGU6IHRydWUsIC8vIFx1Q0U5MFx1QzJEQyBcdUMxMjRcdUM4MTVcclxuXHRcdFx0bWFuaWZlc3Q6IHRydWUsIC8qbWFuaWZlc3Q6IFx1Qzc3NCBcdUM2MzVcdUMxNThcdUM3NDQgdHJ1ZVx1Qjg1QyBcdUMxMjRcdUM4MTVcdUQ1NThcdUJBNzQsIFZpdGVcdUIyOTQgXHVCRTRDXHVCNERDIFx1QzJEQyBtYW5pZmVzdC5qc29uIFx1RDMwQ1x1Qzc3Q1x1Qzc0NCBcdUMwRERcdUMxMzFcdUQ1NjlcdUIyQzhcdUIyRTQuIFx1Qzc3NCBcdUQzMENcdUM3N0NcdUM3NDAgXHVCRTRDXHVCNERDXHVCNDFDIFx1Qzc5MFx1QzZEMChhc3NldHMpXHVDNzU4IFx1QkFBOVx1Qjg1RFx1QUNGQyBcdUQ1NzRcdUMyRENcdUI0MUMgXHVEMzBDXHVDNzdDIFx1Qzc3NFx1Qjk4NFx1Qzc0NCBcdUQzRUNcdUQ1NjhcdUQ1NThcdUFDRTAgXHVDNzg4XHVDNUI0XHVDMTFDLCBcdUMxMUNcdUJDODQgXHVDMEFDXHVDNzc0XHVCNERDXHVDNUQwXHVDMTFDIFx1QzgwMVx1QzgwOFx1RDU1QyBcdUQzMENcdUM3N0MgXHVBQ0JEXHVCODVDXHVCOTdDIFx1Q0MzOFx1Qzg3MFx1RDU2MCBcdUMyMTggXHVDNzg4XHVBQzhDIFx1QjNDNFx1QzY0MFx1QzkwRFx1QjJDOFx1QjJFNC4qL1xyXG5cdFx0XHRvdXRwdXQ6IHtcclxuXHRcdFx0XHQvL1x1RDA3MCBcdUI3N0NcdUM3NzRcdUJFMENcdUI3RUNcdUI5QUNcdUI5N0MgXHVDQUJDXHVBQzFDXHVDMTFDIFx1QjlDQ1x1QjRFNFx1QzVCNFx1QzkwMFx1QjJFNFxyXG5cdFx0XHRcdG1hbnVhbENodW5rczoge1xyXG5cdFx0XHRcdFx0YW50ZDogWydhbnRkJ10sXHJcblx0XHRcdFx0XHRyZWFjdDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuXHRcdFx0XHRcdHJlYWN0Um91dGVyOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuXHRcdFx0XHRcdGF4aW9zOiBbJ2F4aW9zJ10sXHJcblx0XHRcdFx0XHRzdW5lZGl0b3I6IFsnc3VuZWRpdG9yJywgJ3N1bmVkaXRvci1yZWFjdCddXHJcblxyXG5cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cclxuXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlQsU0FBUSxvQkFBbUI7QUFDdFYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQjtBQUFBLEVBQ0M7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE9BQ007QUFWUCxJQUFNLG1DQUFtQztBQWF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUUzQixLQUFLO0FBQUEsSUFDSixxQkFBcUI7QUFBQSxNQUNwQixNQUFNO0FBQUEsUUFDTCxtQkFBbUI7QUFBQSxNQUNwQjtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTix3QkFBd0I7QUFBQSxNQUN2QixVQUFVO0FBQUEsUUFDVCxvQkFBb0I7QUFBQSxRQUNwQixZQUFZO0FBQUEsUUFDWixtQkFBbUI7QUFBQSxRQUNuQixhQUFhO0FBQUEsUUFDYixZQUFZO0FBQUEsTUFDYjtBQUFBLE1BQ0EsTUFBTTtBQUFBLFFBQ0w7QUFBQSxVQUNDLGFBQWE7QUFBQSxVQUNiLFVBQVU7QUFBQSxVQUNWLGNBQWMsQ0FBQyxTQUFTO0FBQ3ZCLG1CQUFPLHFCQUFxQixJQUFJO0FBQUEsVUFDakM7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLElBQ0QsQ0FBQztBQUFBLEVBRUY7QUFBQTtBQUFBLEVBR0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ25DO0FBQUEsRUFDRDtBQUFBLEVBR0EsT0FBTztBQUFBLElBQ04sZUFBZTtBQUFBLE1BQ2QsT0FBTztBQUFBO0FBQUEsTUFDUCxVQUFVO0FBQUE7QUFBQSxNQUNWLFFBQVE7QUFBQTtBQUFBLFFBRVAsY0FBYztBQUFBLFVBQ2IsTUFBTSxDQUFDLE1BQU07QUFBQSxVQUNiLE9BQU8sQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM1QixhQUFhLENBQUMsa0JBQWtCO0FBQUEsVUFDaEMsT0FBTyxDQUFDLE9BQU87QUFBQSxVQUNmLFdBQVcsQ0FBQyxhQUFhLGlCQUFpQjtBQUFBLFFBRzNDO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBR0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

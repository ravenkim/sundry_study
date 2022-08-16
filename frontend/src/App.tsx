import DiffLabeler from './components/diff-labeler/diff-labeler.component';

const testDiffString = `diff --git a/.fikarc b/.fikarc
index c60c679..f1dbbcb 100644
--- a/.fikarc
+++ b/.fikarc
@@ -10,7 +10,7 @@
     "checkoutToFeature": true
   },
   "finish": {
-    "checkOutToDevelop": false,
+    "checkOutToDevelop": true,
     "checkMergeConflict": true
   }
-}
\ No newline at end of file
+}
diff --git a/src/config/constants/default_config.ts b/src/config/constants/default_config.ts
index 5d0016f..65e3852 100644
--- a/src/config/constants/default_config.ts
+++ b/src/config/constants/default_config.ts
@@ -30,10 +30,6 @@ export const defaultConfig: Config = {
       type: AddOnType.GitPlatform,
     },
   ],
-  git: {
-    baseBranch: "develop",
-    issueBranchTemplate: "feature/iss/#<ISSUE_NUMBER>",
-  },
 };
 
 export const defaultLocalConfig: LocalConfig = {
@@ -41,6 +37,7 @@ export const defaultLocalConfig: LocalConfig = {
     develop: "develop",
     main: "master",
     release: "release",
+    issueBranchTemplate: "feature/iss/#<ISSUE_NUMBER>",
   },
   start: {
     fromDevelopOnly: true,
diff --git a/src/domain/entity/config.entity.ts b/src/domain/entity/config.entity.ts
index dbb7fb0..3d0e88a 100644
--- a/src/domain/entity/config.entity.ts
+++ b/src/domain/entity/config.entity.ts
@@ -7,5 +7,4 @@ export class Config {
   notionWorkspace: NotionWorkspace | NotConnected;
   addOns: AddOnConfig[];
   fikaToken: FikaToken | UnAuthenticated;
-  git: GitConfig;
 }
diff --git a/src/domain/service/config.service.ts b/src/domain/service/config.service.ts
index 93e4d9f..4b79914 100644
--- a/src/domain/service/config.service.ts
+++ b/src/domain/service/config.service.ts
@@ -43,23 +43,27 @@ export class ConfigService implements IConfigService {
   }
   createLocalConfig(initialConfigInput: InitialConfigInput): void {
     const localConfig: LocalConfig = defaultLocalConfig;
-    localConfig.branchNames = initialConfigInput.branchNames;
+    localConfig.branchNames = {
+      ...initialConfigInput.branchNames,
+      issueBranchTemplate: localConfig.branchNames.issueBranchTemplate,
+    };
     this._createConfig(this.localPath, LOCAL_CONFIG_NAME, localConfig);
+    this.localConfig = localConfig;
   }
   filterFromCandidates(filterIn: string[], candidates: string[]) {
     return filterIn.filter(item => candidates.includes(item));
   }
   getIssueBranchPattern(): string {
-    if (!this.config.git) {
-      this.updateGitConfig();
+    if (!this.localConfig) {
+      this.localConfig = this.getLocalConfig();
     }
-    return this.config.git.issueBranchTemplate;
+    return this.localConfig.branchNames.issueBranchTemplate;
   }
   parseIssueNumber(branch: string): number {
-    if (!this.config.git) {
-      this.updateGitConfig();
+    if (!this.localConfig) {
+      this.localConfig = this.getLocalConfig();
     }
-    const fragments = this.config.git.issueBranchTemplate.split("<ISSUE_NUMBER>");
+    const fragments = this.localConfig.branchNames.issueBranchTemplate.split("<ISSUE_NUMBER>");
     if (fragments.length == 1) {
       return parseInt(branch.replace(fragments[0], ""));
     } else {
@@ -70,16 +74,16 @@ export class ConfigService implements IConfigService {
     return version;
   }
   getBaseBranch(): string {
-    if (!this.config.git) {
-      this.updateGitConfig();
+    if (!this.localConfig) {
+      this.localConfig = this.getLocalConfig();
     }
-    return this.config.git.baseBranch;
+    return this.localConfig.branchNames.develop;
   }
   getIssueBranch(issueNumber: number): string {
-    if (!this.config.git) {
-      this.updateGitConfig();
+    if (!this.localConfig) {
+      this.localConfig = this.getLocalConfig();
     }
-    const branchTemplate = this.config.git.issueBranchTemplate;
+    const branchTemplate = this.localConfig.branchNames.issueBranchTemplate;
     const isValidTemplate = GitConfig.validateIssueBranch(branchTemplate);
     if (!isValidTemplate) {
       throw Error("Not Valid Issue Branch Template");
@@ -96,21 +100,6 @@ export class ConfigService implements IConfigService {
     }
   }
 
-  private updateGitConfig(): void {
-    this.config = {
-      ...this.config,
-      git: {
-        baseBranch: "develop",
-        issueBranchTemplate: "feature/iss/#<ISSUE_NUMBER>",
-      },
-    };
-    const configString = JSON.stringify(this.config, undefined, 4);
-    if (!this.fikaConfigFilePath) {
-      this.createConfig();
-    }
-    fs.writeFileSync(this.fikaConfigFilePath, configString);
-  }
-
   updateFikaToken(token: string): void {
     this.config = {
       ...this.config,
diff --git a/src/domain/service/i_config.service.ts b/src/domain/service/i_config.service.ts
index 8287b88..a2bcc14 100644
--- a/src/domain/service/i_config.service.ts
+++ b/src/domain/service/i_config.service.ts
@@ -15,6 +15,7 @@ export interface LocalConfig {
     develop: string;
     main: string;
     release: string;
+    issueBranchTemplate: string;
   };
   start: {
     fromDevelopOnly: boolean;
diff --git a/test/test-constants/index.ts b/test/test-constants/index.ts
index 33e9df8..b98ffbb 100644
--- a/test/test-constants/index.ts
+++ b/test/test-constants/index.ts
@@ -52,9 +52,5 @@ export const testUserConfig: Config = {
       name: "Github.GitPlatform",
       type: AddOnType.GitPlatform,
     },
-  ],
-  git: {
-    baseBranch: 'develop',
-    issueBranchTemplate: 'feature/iss/#<ISSUE_NUMBER>',
-  }
+  ]
 }
\ No newline at end of file`;

function App() {
  return <DiffLabeler diffString={testDiffString} />;
}

export default App;

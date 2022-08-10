import DiffViewer from './components/DiffViewer';

const testDiffString = `diff --git a/.fikarc b/.fikarc
new file mode 100644
index 0000000..c60c679
--- /dev/null
+++ b/.fikarc
@@ -0,0 +1,16 @@
+{
+  "branchNames": {
+    "develop": "develop",
+    "main": "master",
+    "release": "release"
+  },
+  "start": {
+    "fromDevelopOnly": true,
+    "pullBeforeAlways": true,
+    "checkoutToFeature": true
+  },
+  "finish": {
+    "checkOutToDevelop": false,
+    "checkMergeConflict": true
+  }
+}
\ No newline at end of file
diff --git a/package.json b/package.json
index d319f4d..3383adc 100644
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
   "name": "fika-cli",
-  "version": "0.3.9-beta",
+  "version": "0.4.0-beta",
   "description": "",
   "author": {
     "name": "Wonmo Jung",`;

function App() {
  return (
    <div>
      <header></header>
      <DiffViewer diffString={testDiffString} index={0} />
    </div>
  );
}

export default App;

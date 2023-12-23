xcopy .\LICENSE .\dist\libs\psychrometrics\ /Y
xcopy .\README.md .\dist\libs\psychrometrics\ /Y
node .\tools\scripts\cleanPackage.mjs
cd dist/libs/psychrometrics
REM npm publish --tag=latest --access public

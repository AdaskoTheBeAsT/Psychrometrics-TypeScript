xcopy .\LICENSE .\dist\libs\psychrometrics\ /Y
xcopy .\README.md .\dist\libs\psychrometrics\ /Y
cd dist/libs/psychrometrics
npm publish --tag=latest --access public

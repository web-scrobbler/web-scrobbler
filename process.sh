rm -r ./build
npm run build chrome
rm -r ~/Desktop/chrome
cp -r ./build/chrome ~/Desktop

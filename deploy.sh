rm -rf ./dist ./build
npm run build
mv ./build ./dist
git add ./dist
git commit -m 'pushing ./dist to be deployed on gh-pages'
git push --delete origin gh-pages
git subtree push --prefix dist origin gh-pages
rm -rf ./dist ./build
git add ./dist
git commit -m 'removing build'
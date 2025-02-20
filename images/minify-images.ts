import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

export async function minifyImages() {
	for (const browser of ['chrome', 'firefox', 'safari']) {
		await imagemin([`build/${browser}/icons/*.png`], {
			destination: `build/${browser}/icons`,
			plugins: [imageminPngquant()],
		});
		await imagemin(['img/main/*.{jpg,png}'], {
			destination: `build/${browser}/img`,
			plugins: [imageminJpegtran(), imageminPngquant()],
		});
		if (browser === 'safari') {
			await imagemin(['img/safari/*.{jpg,png}'], {
				destination: '../.xcode/Web Scrobbler/Shared (App)/Resources',
				plugins: [imageminJpegtran(), imageminPngquant()],
			});
		}
	}
}

const Imagemin = require('imagemin');
const webp = require('imagemin-webp');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

async function findFiles(dir, extensions) {
	const items = await readdir(dir);
	const files = await Promise.all(items.map(async (item) => {
		const fullPath = path.join(dir, item);
		const isDir = (await stat(fullPath)).isDirectory();
		return isDir ? findFiles(fullPath, extensions) : fullPath;
	}));
	return files
		.flat()
		.filter(file => extensions.includes(path.extname(file).toLowerCase()));
}

(async () => {
	try {
		// 1. Находим все изображения
		const images = await findFiles(
			path.resolve(__dirname, '../src/assets/images'),
			['.jpg', '.png']
		);


		// 2. Создаем временные копии
		await Promise.all(images.map(async (img) => {
			await copyFile(img, `${img}${path.extname(img)}`);
		}));

		// 3. Конвертируем в WebP
		const tempFiles = await findFiles(
			path.resolve(__dirname, '../src/assets/images'),
			['.jpg.jpg', '.png.png']
		);

		for (const file of tempFiles) {

			const outputDir = path.resolve(
				__dirname,
				'../html/assets/images',
				path.relative(
					path.resolve(__dirname, '../src/assets/images'),
					path.dirname(file)
				)
			);

			await mkdir(outputDir, { recursive: true });

			await Imagemin([file], {
				destination: outputDir,
				plugins: [webp({ quality: 90 })]
			});
		}

		// 4. Удаляем временные файлы
		await Promise.all(tempFiles.map(file => unlink(file)));

		console.log('WebP конвертация завершена успешно!');
	} catch (err) {
		console.error('Ошибка:', err);
		process.exit(1);
	}
})();
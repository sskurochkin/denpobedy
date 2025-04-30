const Imagemin = require('imagemin');
const webp = require("imagemin-webp");
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');

(async () => {
	try {
		// 1. Рекурсивно находим все изображения
		const imagePaths = await glob('../src/assets/images/**/*.{jpg,png}', {
			ignore: '**/*.webp',
			nodir: true
		});

		// 2. Создаем временные файлы с двойным расширением
		for (const imagePath of imagePaths) {
			const ext = path.extname(imagePath);
			const newPath = `${imagePath}${ext}`;
			await fs.promises.copyFile(imagePath, newPath);
		}

		// 3. Конвертируем в WebP с правильным указанием destination
		const filesToConvert = await glob('../src/assets/images/**/*.{jpg,png}.{jpg,png}');

		for (const file of filesToConvert) {
			const relativePath = path.relative('../src/assets/images', path.dirname(file));
			const outputDir = path.resolve(__dirname, '../html/images', relativePath);


			console.log(`Обрабатываю: ${file} -> ${outputDir}`);
			// Создаем целевую директорию, если ее нет
			await fs.promises.mkdir(outputDir, { recursive: true });

			await Imagemin([file], {
				destination: outputDir, // Теперь это строка, а не функция
				plugins: [
					webp({
						quality: 90,
						metadata: 'all'
					})
				]
			});
		}

		// 4. Удаляем временные файлы
		const tempFiles = await glob('../src/assets/images/**/*.{jpg,png}.{jpg,png}');
		for (const file of tempFiles) {
			await fs.promises.unlink(file);
		}

		console.log('✅ Конвертация в WebP успешно завершена!');
	} catch (error) {
		console.error('❌ Ошибка при конвертации:', error);
		process.exit(1);
	}
})();
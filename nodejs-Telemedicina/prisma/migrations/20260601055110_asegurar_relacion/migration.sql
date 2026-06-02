-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `medicoId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

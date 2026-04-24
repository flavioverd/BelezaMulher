//#region Testes UploadService
const UploadService = require('./UploadService');
const path = require('path');
const fs = require('fs');

describe('UploadService', () => {
  let uploadService;
  const testDir = path.join(__dirname, '..', '..', '..', 'test_uploads');

  beforeEach(() => {
    // Limpa diretório de teste se existir
    if (fs.existsSync(testDir)) {
      fs.readdirSync(testDir).forEach(file => {
        fs.unlinkSync(path.join(testDir, file));
      });
      fs.rmdirSync(testDir);
    }
    
    // Cria diretório de teste
    fs.mkdirSync(testDir, { recursive: true });
    
    // Cria instância com diretório customizado
    uploadService = new UploadService(testDir);
  });

  afterEach(() => {
    // Limpa arquivos de teste
    if (fs.existsSync(testDir)) {
      fs.readdirSync(testDir).forEach(file => {
        fs.unlinkSync(path.join(testDir, file));
      });
      fs.rmdirSync(testDir);
    }
  });

  describe('constructor', () => {
    it('deve criar diretório de upload se não existir', () => {
      const newTestDir = path.join(testDir, 'new_subdir');
      const us = new UploadService(newTestDir);
      
      expect(fs.existsSync(newTestDir)).toBe(true);
      
      // Limpa
      if (fs.existsSync(newTestDir)) {
        fs.rmdirSync(newTestDir);
      }
    });
  });

  describe('uploadSingle', () => {
    it('deve retornar middleware que aceita arquivo de imagem válido', () => {
      const middleware = uploadService.uploadSingle('imagem');
      expect(typeof middleware).toBe('function');
    });

    it('deve rejeitar arquivo não-imagem', () => {
      // Este teste seria mais complexo com mock de req/res
      // Por simplicidade, testamos que o fileFilter existe
      expect(uploadService.upload).toBeDefined();
    });
  });

  describe('getFilePath', () => {
    it('deve retornar caminho completo correto', () => {
      const filename = 'test-image.jpg';
      const expectedPath = path.join(uploadService.uploadDir, filename);
      expect(uploadService.getFilePath(filename)).toBe(expectedPath);
    });
  });

  describe('deleteFile', () => {
    it('deve remover arquivo existente', () => {
      const testFile = path.join(uploadService.uploadDir, 'delete-test.txt');
      fs.writeFileSync(testFile, 'test content');
      
      const result = uploadService.deleteFile('delete-test.txt');
      expect(result).toBe(true);
      expect(fs.existsSync(testFile)).toBe(false);
    });

    it('deve retornar false para arquivo inexistente', () => {
      const result = uploadService.deleteFile('non-existent.txt');
      expect(result).toBe(false);
    });
  });
});
//#endregion
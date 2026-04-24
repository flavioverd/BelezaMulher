//#region Upload Service - Infraestrutura (multer para upload de imagens)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class UploadService {
  //#region constructor - Configuração
  constructor(customUploadDir) {
    // Define diretório de upload
    if (customUploadDir) {
      this.uploadDir = customUploadDir;
    } else {
      this.uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
    }
    
    // Cria diretório se não existir
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
    // Configuração do multer
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        // Gera nome único: timestamp + nome original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    });
    
    // Filtro de arquivos (apenas imagens)
    this.fileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
      }
    };
    
    // Limite de tamanho (5MB)
    this.limits = { fileSize: 5 * 1024 * 1024 };
    
    // Instancia o multer
    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: this.limits
    });
  }
  //#endregion

  //#region uploadSingle - Faz upload de um único arquivo
  uploadSingle(fieldName) {
    return (req, res, next) => {
      this.upload.single(fieldName)(req, res, (err) => {
        if (err) {
          return res.status(400).json({ erro: err.message });
        }
        next();
      });
    };
  }
  //#endregion

  //#region getFilePath - Retorna caminho completo do arquivo
  getFilePath(filename) {
    return path.join(this.uploadDir, filename);
  }
  //#endregion

  //#region deleteFile - Remove arquivo do sistema
  deleteFile(filename) {
    const filePath = this.getFilePath(filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
  //#endregion
}

module.exports = UploadService;
//#endregion
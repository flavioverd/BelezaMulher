# BelezaMulher Mobile - React Native

## Como Rodar no Android

### Pré-requisitos

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Java JDK 17+** - [Download](https://adoptium.net/)
3. **Android Studio** - [Download](https://developer.android.com/studio)
4. **SDK Android** - Configure via Android Studio

### Passo a Passo

#### 1. Instalar Dependências

```bash
cd mobile
npm install
```

#### 2. Configurar Variáveis de Ambiente

No Windows, adicione ao PATH:
```
ANDROID_HOME=C:\Users\SeuUsuario\AppData\Local\Android\Sdk
```

#### 3. Conectar Device Android

**Opção A - USB Debugging:**
1. Ative Developer Options no celular
2. Enable USB Debugging
3. Conecte via USB
4. Execute: `adb devices`

**Opção B - Emulador:**
1. Crie emulador via Android Studio (AVD Manager)
2. Inicie o emulador
3. Execute: `npx react-native start`

#### 4. Rodar o App

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2: Install no device
npm run android
```

#### 5. Gerar APK para Teste

```bash
cd android
./gradlew assembleDebug
```

O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

Copie para o celular e instale.

### Solução de Problemas

| Erro | Solução |
|------|--------|
| SDK not found | Configure ANDROID_HOME |
| JDK error | Use JDK 17+ |
| device not found | Verifique USB debugging |
| Metro not responding | Reinicie com `npx react-native start --reset-cache` |

### Estrutura do Projeto

```
mobile/
├── src/
│   ├── context/        # AuthContext, CartContext
│   ├── screens/        # Home, Login, Register, Cart, Pedidos
│   ├── services/       # ApiService
│   └── navigation/     # AppNavigator
├── App.js             # Entry point
└── index.js          # React Native entry
```
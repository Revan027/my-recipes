// Les .ttf importés depuis le TypeScript sont inlinés en base64 par le bundler
// (voir "loader" dans angular.json). C'est exactement le format qu'attend
// pdfMake.addVirtualFileSystem, sans conversion à l'exécution.
declare module '*.ttf' {
    const base64: string;
    export default base64;
}

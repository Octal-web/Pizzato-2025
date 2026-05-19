<?php

namespace App\Http\Controllers\Intranet;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Exception;

class FileController extends Controller
{
    private $basePath;

    public function __construct()
    {
        $this->basePath = public_path('files');
    }

    public function index(Request $request)
    {
        $path = $request->get('path', '');
        $fullPath = realpath($this->basePath . '/' . $path);

        if (!$fullPath || strpos($fullPath, $this->basePath) !== 0) {
            abort(403, 'Acesso negado');
        }

        $files = collect(File::files($fullPath))->map(function ($file) use ($path) {
            return [
                'name' => $file->getFilename(),
                'type' => 'file',
                'size' => $file->getSize(),
                'modified' => $file->getMTime(),
                'path' => trim($path, '/'),
            ];
        });

        $folders = collect(File::directories($fullPath))->map(function ($folder) use ($path) {
            return [
                'name' => basename($folder),
                'type' => 'folder',
                'size' => null,
                'modified' => filemtime($folder),
                'path' => trim($path, '/'),
            ];
        });

        return Inertia::render('Intranet/Index', [
            'files' => $folders->merge($files)->values(),
            'currentPath' => trim($path, '/'),
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480',
            'path' => 'nullable|string',
        ]);

        try {
            $path = trim($request->path, '/');
            $request->file('file')->move(
                $this->basePath . '/' . $path,
                $request->file('file')->getClientOriginalName()
            );

            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Arquivo enviado com sucesso.']);
        } catch (Exception $e) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao enviar o arquivo.']);
        }
    }

    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'path' => 'nullable|string',
        ]);

        try {
            $path = trim($request->path, '/');
            File::makeDirectory($this->basePath . '/' . $path . '/' . $request->name, 0755, true);

            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Pasta criada com sucesso.']);
        } catch (Exception $e) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao criar a pasta.']);
        }
    }

    public function rename(Request $request)
    {
        $request->validate([
            'oldName' => 'required|string',
            'newName' => 'required|string',
            'path' => 'nullable|string',
        ]);

        $path = trim($request->path, '/');
        $oldPath = $this->basePath . '/' . $path . '/' . $request->oldName;
        $newPath = $this->basePath . '/' . $path . '/' . $request->newName;

        if (!file_exists($oldPath)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Arquivo ou pasta não encontrado.']);
        }

        if (file_exists($newPath)) {
            return redirect()->back()->with('message', ['type' => 'alert', 'msg' => 'Já existe um arquivo ou pasta com esse nome.']);
        }

        if (rename($oldPath, $newPath)) {
            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Renomeado com sucesso.']);
        }

        return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao renomear.']);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'path' => 'nullable|string',
        ]);

        $path = trim($request->path, '/');
        $target = $this->basePath . '/' . $path . '/' . $request->name;

        if (is_dir($target)) {
            File::deleteDirectory($target);
            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Pasta excluída com sucesso.']);
        } elseif (file_exists($target)) {
            unlink($target);
            return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Arquivo excluído com sucesso.']);
        }

        return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Arquivo ou pasta não encontrado.']);
    }

    public function move(Request $request)
    {
        $request->validate([
            'sourceName' => 'required|string',
            'sourcePath' => 'nullable|string',
            'targetPath' => 'required|string',
        ]);

        $sourcePath = trim($request->sourcePath, '/');
        $targetPath = trim($request->targetPath, '/');
        
        $sourceFullPath = $this->basePath . '/' . $sourcePath . '/' . $request->sourceName;
        $targetFullPath = $this->basePath . '/' . $targetPath . '/' . $request->sourceName;

        if (!file_exists($sourceFullPath)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Arquivo ou pasta não encontrado.']);
        }

        $targetDir = $this->basePath . '/' . $targetPath;
        if (!is_dir($targetDir)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Pasta de destino não encontrada.']);
        }

        if (file_exists($targetFullPath)) {
            return redirect()->back()->with('message', ['type' => 'alert', 'msg' => 'Já existe um item com esse nome na pasta de destino.']);
        }

        if (is_dir($sourceFullPath) && strpos($targetPath, $sourcePath . '/' . $request->sourceName) === 0) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não é possível mover uma pasta para dentro dela mesma.']);
        }

        try {
            if (rename($sourceFullPath, $targetFullPath)) {
                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Movido com sucesso.']);
            } else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao mover.']);
            }
        } catch (Exception $e) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Erro ao mover: ' . $e->getMessage()]);
        }
    }

    public function download(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'path' => 'nullable|string',
        ]);

        $path = trim($request->path, '/');
        $file = $this->basePath . '/' . $path . '/' . $request->name;

        if (file_exists($file)) {
            return response()->download($file);
        }

        return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Arquivo não encontrado.']);
    }

    public function deleteMultiple(Request $request)
    {
        $filesToDelete = $request->json('files');

        $request->validate([
            'files' => 'required|array',
            'files.*.name' => 'required|string',
            'files.*.path' => 'nullable|string',
        ]);

        $deletedCount = 0;
        $errors = [];

        foreach ($filesToDelete as $fileData) {
            $path = trim($fileData['path'], '/');
            $target = $this->basePath . '/' . $path . '/' . $fileData['name'];

            try {
                if (is_dir($target)) {
                    File::deleteDirectory($target);
                    $deletedCount++;
                } elseif (file_exists($target)) {
                    unlink($target);
                    $deletedCount++;
                } else {
                    $errors[] = "Arquivo '{$fileData['name']}' não encontrado.";
                }
            } catch (Exception $e) {
                $errors[] = "Erro ao excluir '{$fileData['name']}': " . $e->getMessage();
            }
        }

        if (count($errors) > 0) {
            $message = $deletedCount > 0 
                ? "Alguns arquivos foram excluídos ($deletedCount), mas houve erros: " . implode(', ', $errors)
                : "Erro ao excluir arquivos: " . implode(', ', $errors);
            
            return redirect()->back()->with('message', [
                'type' => 'alert', 
                'msg' => $message
            ]);
        }

        return redirect()->back()->with('message', [
            'type' => 'success', 
            'msg' => "$deletedCount arquivo(s) excluído(s) com sucesso."
        ]);
    }

    public function moveMultiple(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*.name' => 'required|string',
            'files.*.sourcePath' => 'nullable|string',
            'targetPath' => 'required|string',
        ]);

        $targetPath = trim($request->targetPath, '/');
        $targetDir = $this->basePath . '/' . $targetPath;

        if (!is_dir($targetDir)) {
            return redirect()->back()->with('message', [
                'type' => 'error', 
                'msg' => 'Pasta de destino não encontrada.'
            ]);
        }

        $movedCount = 0;
        $errors = [];

        foreach ($request->files as $fileData) {
            $sourcePath = trim($fileData['sourcePath'], '/');
            $sourceFullPath = $this->basePath . '/' . $sourcePath . '/' . $fileData['name'];
            $targetFullPath = $this->basePath . '/' . $targetPath . '/' . $fileData['name'];

            try {
                if (!file_exists($sourceFullPath)) {
                    $errors[] = "Arquivo '{$fileData['name']}' não encontrado.";
                    continue;
                }

                if (file_exists($targetFullPath)) {
                    $errors[] = "Já existe um item '{$fileData['name']}' na pasta de destino.";
                    continue;
                }
                
                if (is_dir($sourceFullPath) && strpos($targetPath, $sourcePath . '/' . $fileData['name']) === 0) {
                    $errors[] = "Não é possível mover a pasta '{$fileData['name']}' para dentro dela mesma.";
                    continue;
                }

                if (rename($sourceFullPath, $targetFullPath)) {
                    $movedCount++;
                } else {
                    $errors[] = "Erro ao mover '{$fileData['name']}'.";
                }
            } catch (Exception $e) {
                $errors[] = "Erro ao mover '{$fileData['name']}': " . $e->getMessage();
            }
        }

        if (count($errors) > 0) {
            $message = $movedCount > 0 
                ? "Alguns arquivos foram movidos ($movedCount), mas houve erros: " . implode(', ', $errors)
                : "Erro ao mover arquivos: " . implode(', ', $errors);
            
            return redirect()->back()->with('message', [
                'type' => 'alert', 
                'msg' => $message
            ]);
        }

        return redirect()->back()->with('message', [
            'type' => 'success', 
            'msg' => "$movedCount arquivo(s) movido(s) com sucesso."
        ]);
    }

    public function downloadMultiple(Request $request)
    {
        $filesParam = $request->query('files');
        
        if (!$filesParam) {
            return redirect()->back()->with('message', [
                'type' => 'error', 
                'msg' => 'Nenhum arquivo especificado para download.'
            ]);
        }

        $files = json_decode($filesParam, true);
        
        if (!$files || !is_array($files)) {
            return redirect()->back()->with('message', [
                'type' => 'error', 
                'msg' => 'Dados de arquivos inválidos.'
            ]);
        }

        if (count($files) === 1) {
            $fileData = $files[0];
            $path = trim($fileData['path'], '/');
            $file = $this->basePath . '/' . $path . '/' . $fileData['name'];
            
            if (file_exists($file)) {
                return response()->download($file);
            }
            
            return redirect()->back()->with('message', [
                'type' => 'error', 
                'msg' => 'Arquivo não encontrado.'
            ]);
        }

        $zip = new \ZipArchive();
        $zipFileName = 'arquivos_' . date('Y-m-d_H-i-s') . '.zip';
        $zipPath = storage_path('app/temp/' . $zipFileName);
        
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        if ($zip->open($zipPath, \ZipArchive::CREATE) !== TRUE) {
            return redirect()->back()->with('message', [
                'type' => 'error', 
                'msg' => 'Não foi possível criar o arquivo ZIP.'
            ]);
        }

        $addedFiles = 0;
        foreach ($files as $fileData) {
            $path = trim($fileData['path'], '/');
            $filePath = $this->basePath . '/' . $path . '/' . $fileData['name'];
            
            if (file_exists($filePath) && !is_dir($filePath)) {
                $zip->addFile($filePath, $fileData['name']);
                $addedFiles++;
            }
        }

        $zip->close();

        if ($addedFiles === 0) {
            unlink($zipPath);
            return redirect()->back()->with('message', [
                'type' => 'error', 
                'msg' => 'Nenhum arquivo válido encontrado para download.'
            ]);
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }
}

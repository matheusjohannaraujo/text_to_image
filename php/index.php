<?php

$nomeDoArquivo = "texto.txt";
$caminho = "../texto/" . $nomeDoArquivo;

if(!file_exists($caminho)){
    exit("Arquivo não encontrado.");
}else if(!empty($_REQUEST)){

    if(isset($_REQUEST["md5"])){
        exit(md5_file($caminho));
    }

    if(($largura = $_REQUEST["largura"] ?? 1366)){
        $file = file($caminho);
        $largura = (int) $largura;
        $altura = (count($file) * 20) + 15;
        $imagem = ImageCreate($largura, $altura);
        $fundo = ImageColorAllocate($imagem, rand(80, 125), rand(80, 125), rand(80, 125));
        $letra = ImageColorAllocate($imagem, 255, 255, 255);
        $nlinha = 10;
        foreach ($file as $key => $value) {
            $value = utf8_decode($value);
            $value = str_replace("\n", "", $value);
            $value = str_replace("\r", "", $value);            
            ImageString($imagem, 5, 10, $nlinha, $value, $letra);
            $nlinha += 20;
        }
        header("Content-type: image/jpeg; charset=utf-8");
        header("Content-Disposition: inline; filename='text_to_image.jpeg'");
        ImageJpeg($imagem, NULL, 100);
        ImageDestroy($imagem);
        exit;
    }
        
}else{
    echo "<pre>";
    require_once $caminho;
    exit("</pre>");
}

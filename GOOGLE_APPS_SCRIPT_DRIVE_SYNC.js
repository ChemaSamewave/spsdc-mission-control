/**
 * GOOGLE APPS SCRIPT - SPSDC MISSION CONTROL
 * Sincronización en vivo de Censo de Alumnos y Almacenamiento de Entregas en Google Drive
 * 
 * INSTRUCCIONES DE INSTALACIÓN (Solo 1 minuto):
 * 1. Entra en https://script.google.com/home
 * 2. Abre tu proyecto del Webhook de SPSIN ("SPSDC Webhook" o similar).
 * 3. Borra todo el código que haya en el editor y pega este código completo.
 * 4. Arriba a la derecha, pulsa "Implementar" -> "Administrar implementaciones".
 * 5. Pulsa en el icono de lápiz (Editar), en Versión selecciona "Nueva versión", y pulsa "Implementar".
 * 6. ¡Listo! A partir de ese momento, cualquier cambio de alumnos hecho por cualquier profesor
 *    se guardará y sincronizará en tiempo real en tu carpeta 'SPSIN COLEGIOS' de Google Drive.
 */

const ROOT_FOLDER_NAME = "SPSIN COLEGIOS";
const CENSUS_FILE_NAME = "students_census.json";

function getOrCreateFolder(folderName, parent) {
  var parentFolder = parent || DriveApp.getRootFolder();
  var folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parentFolder.createFolder(folderName);
}

// 1. OBTENER CENSO EN VIVO (GET)
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'getCensus';

  if (action === 'getCensus') {
    try {
      var root = getOrCreateFolder(ROOT_FOLDER_NAME);
      var files = root.getFilesByName(CENSUS_FILE_NAME);
      if (files.hasNext()) {
        var content = files.next().getBlob().getDataAsString('UTF-8');
        return ContentService.createTextOutput(content)
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput("[]")
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    service: "SPSDC Mission Control Google Drive Sync",
    time: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// 2. GUARDAR CENSO EN VIVO O SUBIR ENTREGAS (POST)
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sin contenido" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);

    // CASO A: GUARDAR EL CENSO DE ALUMNOS EN GOOGLE DRIVE
    if (data.action === 'saveCensus') {
      var root = getOrCreateFolder(ROOT_FOLDER_NAME);
      var files = root.getFilesByName(CENSUS_FILE_NAME);
      var jsonStr = JSON.stringify(data.students, null, 2);
      var file;

      if (files.hasNext()) {
        file = files.next();
        file.setContent(jsonStr);
      } else {
        file = root.createFile(CENSUS_FILE_NAME, jsonStr, MimeType.PLAIN_TEXT);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "saveCensus",
        count: (data.students || []).length,
        savedAt: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // CASO B: OBTENER EL CENSO MEDIANTE POST (Alternativa por si falla GET)
    if (data.action === 'getCensus') {
      var root = getOrCreateFolder(ROOT_FOLDER_NAME);
      var files = root.getFilesByName(CENSUS_FILE_NAME);
      if (files.hasNext()) {
        var content = files.next().getBlob().getDataAsString('UTF-8');
        return ContentService.createTextOutput(content)
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput("[]")
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // CASO C: SUBIDA DE ENTREGAS DE ALUMNOS (Sprint Files)
    var rootFolder = getOrCreateFolder(ROOT_FOLDER_NAME);
    var schoolFolder = getOrCreateFolder(data.school || "OTROS", rootFolder);
    var sprintFolder = getOrCreateFolder(data.sprint || "SPRINT-01", schoolFolder);
    var teamFolder = getOrCreateFolder(data.teamName || "ENTREGA", sprintFolder);

    var savedFiles = [];
    if (data.files && Array.isArray(data.files)) {
      for (var i = 0; i < data.files.length; i++) {
        var f = data.files[i];
        if (f.base64Data && f.name) {
          var cleanBase64 = f.base64Data.replace(/^data:[^;]+;base64,/, "");
          var decoded = Utilities.base64Decode(cleanBase64);
          var blob = Utilities.newBlob(decoded, f.type || "application/octet-stream", f.name);
          var savedFile = teamFolder.createFile(blob);
          savedFiles.push(savedFile.getName());
        }
      }
    }

    // Guardar metadata de la entrega
    var metaContent = "ENTREGA DE PROYECTO SPSDC\n" +
                      "==========================\n" +
                      "Colegio: " + (data.school || "") + "\n" +
                      "Sprint: " + (data.sprint || "") + "\n" +
                      "Equipo / Autor: " + (data.teamName || "") + "\n" +
                      "Autores detallados: " + (data.authors || "") + "\n" +
                      "Fecha UTC: " + new Date().toISOString() + "\n" +
                      "Enlace externo: " + (data.externalLink || "Ninguno") + "\n" +
                      "Notas:\n" + (data.notes || "") + "\n";
    teamFolder.createFile("INFO_ENTREGA_" + (data.teamName || "EQUIPO") + ".txt", metaContent, MimeType.PLAIN_TEXT);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      savedDir: ROOT_FOLDER_NAME + "/" + (data.school || "") + "/" + (data.sprint || "") + "/" + (data.teamName || ""),
      filesSaved: savedFiles.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

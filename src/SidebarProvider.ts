import * as vscode from 'vscode';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'onInfo': {
          const workspaceFolders = vscode.workspace.workspaceFolders;
          console.log(workspaceFolders);
          if (!workspaceFolders || workspaceFolders.length === 0) {
            return;
          }
          console.log(workspaceFolders);
          const firstWorkspacePath = workspaceFolders[0]?.uri.fsPath;
          vscode.window.showInformationMessage(firstWorkspacePath);
          break;
        }
        case 'onError': {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `
      <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Droid Panel</title>
        <style>
            body {
                padding: 20px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }
            h1 {
                font-size: 20px;
                margin-bottom: 20px;
            }
            button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                cursor: pointer;
                border-radius: 2px;
                margin: 5px;
            }
            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <h1>🤖 Droid Panel</h1>
        <p>Welcome to your custom sidebar!</p>
        <button id="infoBtn">Show Info</button>
        <button id="errorBtn">Show Error</button>

        <script>
            const vscode = acquireVsCodeApi();

            document.getElementById('infoBtn').addEventListener('click', () => {
                vscode.postMessage({
                    type: 'onInfo',
                    value: 'Hello from the sidebar!'
                });
            });

            document.getElementById('errorBtn').addEventListener('click', () => {
                vscode.postMessage({
                    type: 'onError',
                    value: 'This is an error message'
                });
            });
        </script>
    </body>
</html>
  `;
  }
}

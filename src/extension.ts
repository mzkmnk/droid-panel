import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("droid-panel.sidebarView", sidebarProvider)
  );

  const disposable = vscode.commands.registerCommand("droid-panel.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from droid-panel!");
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

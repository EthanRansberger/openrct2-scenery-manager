import { SceneryManager } from "./SceneryManager";
import { BoxBuilder } from "./WindowBuilder";

class About {
    constructor(_manager: SceneryManager) { }

    build(builder: BoxBuilder): void {
        const separator: string = "++++++++++++++++++++++++++++++++++++++++++++++++++++";

        builder.addLabel({ text: separator });
        builder.addSpace(0);
        this.addText(builder, [
            "Idea & development by Sadret.",
            "If you want to support me, you can buy me a coffee:",
            "https://www.BuyMeACoffee.com/SadretGaming",
        ]);
        builder.addSpace(0);
        builder.addLabel({ text: separator });
        builder.addSpace(0);
        this.addText(builder, [
            "Visit GitHub for updates:",
            "https://github.com/Sadret/openrct2-scenery-manager",
            "If you like this plug-in, please leave a star on GitHub.",
        ]);
        builder.addSpace(0);
        builder.addLabel({ text: separator });
        builder.addSpace(0);
        this.addText(builder, [
            "If you find any bugs or if you have ideas for",
            "improvements, you can open an issue on GitHub",
            "or contact me on Discord: Sadret#2502",
        ]);
        builder.addSpace(0);
        builder.addLabel({ text: separator });
    }

    addText(builder: BoxBuilder, lines: string[]) {
        const hbox = builder.getHBox([1, 8, 1], 0);
        hbox.addSpace(0);

        const vbox = hbox.getVBox(builder.padding);
        lines.forEach((line: string) => vbox.addLabel({ text: line }));
        hbox.addBox(vbox);

        hbox.addSpace(0);
        builder.addBox(hbox);
    }
}
export default About;

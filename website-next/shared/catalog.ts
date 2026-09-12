const initialProducts=[
{id:'plugin-auto-packer',name:'UEPluginAutoPacker',mark:'AP',color:'blue',category:'ue',repo:'https://github.com/MZSH-Tools/UEPluginAutoPacker',zh:{label:'多版本插件打包',description:'把多引擎版本构建、打包日志与 Fab 包整理集中到一处。',features:['管理多个 Unreal Engine 版本','GUI 与命令行工作流','构建日志与 Fab 文件整理'],steps:['从 Release 下载 Windows 程序。','放入包含 .uproject 的项目根目录，配置引擎与插件。','运行打包，检查日志与输出文件。'],problem:'多版本插件发布时，需要反复切换引擎、打包和整理文件。',result:'把相关步骤集中到工具中，保留可检查的构建日志。'},en:{label:'Multi-version packaging',description:'Bring multi-engine builds, packaging logs, and Fab preparation into one workflow.',features:['Manage multiple Unreal Engine versions','GUI and command-line workflows','Build logs and Fab package preparation'],steps:['Download the Windows executable from Releases.','Place it in a project folder with a .uproject file and configure engines and plugins.','Run packaging and review the logs and output.'],problem:'Repeated engine switching, builds, and file preparation when publishing plugins.',result:'A focused tool that brings the steps together with inspectable build logs.'}},
{id:'plugin-manager',name:'UEPluginManager',mark:'PM',color:'violet',category:'ue',repo:'https://github.com/MZSH-Tools/UEPluginManager',zh:{label:'插件管理',description:'统一查找项目、引擎与商城插件，理清依赖和冲突。',features:['扫描项目、引擎与商城插件','搜索、依赖和冲突分析','启停、移动与回收站删除'],steps:['从 Release 获取 Windows 程序。','放到 Unreal Engine 项目目录并运行。','扫描插件，查看依赖和冲突后执行需要的操作。'],problem:'插件分散在不同目录，版本和依赖关系不容易查看。',result:'用一个入口组织插件信息与常用管理操作。'},en:{label:'Plugin management',description:'Find project, engine, and marketplace plugins in one place. Understand dependencies and conflicts.',features:['Scan project, engine, and marketplace plugins','Search, dependencies, and conflict analysis','Enable, move, or send plugins to the recycle bin'],steps:['Get the Windows executable from Releases.','Place it in your Unreal Engine project directory and run it.','Scan plugins, review dependencies and conflicts, then choose the relevant action.'],problem:'Plugins spread across folders make versions and dependencies difficult to inspect.',result:'A single place for plugin information and common management operations.'}},
{id:'md-blog-packer',name:'MDBlogPacker',mark:'MD',color:'teal',category:'writing',repo:'https://github.com/MZSH-Tools/MDBlogPacker',zh:{label:'Markdown 发布辅助',description:'将 Markdown 中的本地图片转为 Base64，转换后直接复制。',features:['本地图片转 Base64 内嵌','支持 Wiki 风格图片引用','前后缀设置与 GUI / CLI 使用'],steps:['从 Release 获取程序，或按 README 配置源码环境。','选择 Markdown，确认图片引用及输出选项。','转换并复制，在目标平台检查最终显示。'],problem:'文章中的本地图片路径无法直接随 Markdown 发布。',result:'将图片内嵌到文本，让整理和复制更方便。'},en:{label:'Markdown publishing utility',description:'Embed local Markdown images as Base64, then copy the converted content.',features:['Embed local images as Base64','Support wiki-style image references','Prefix/suffix options and GUI / CLI use'],steps:['Get a release or follow the README to set up the source environment.','Choose a Markdown file and check image references and output options.','Convert and copy the result, then check rendering on your target platform.'],problem:'Local image paths do not travel with an article when publishing Markdown.',result:'Embed images in the text to simplify preparation and copying.'}}
];

export type ProductCopy = { label:string; description:string; features:string[]; steps:string[]; problem:string; result:string };
export type Product = { id:string; name:string; mark:string; color:string; category:string; repo:string; docPath?:string; license?:string; download?:string; zh:ProductCopy; en:ProductCopy };
export const products:Product[] = initialProducts.map(product => ({...product, docPath:'tools/'+product.id, license:product.id==='md-blog-packer'?'MIT':undefined, download:product.repo+'/releases'}));
export const works = [
  {id:'plugin-release-workflow',productIds:['plugin-auto-packer','plugin-manager'],
   zh:{title:'插件开发到发布的工具链',summary:'围绕插件管理与多版本打包，把开发中分散的操作整理成专用工具。',kind:'工具实践',challenge:'插件安装位置、依赖和引擎版本分别影响开发与发布，靠手动整理容易遗漏。',approach:'UEPluginManager 负责查找插件与梳理依赖；UEPluginAutoPacker 负责多版本构建、日志与发布包整理。两款工具各自聚焦一段工作。',outcome:'形成插件管理和打包两个可独立使用的工具。具体支持范围和操作步骤见产品与文档。'},
   en:{title:'A toolchain for plugin development and release',summary:'Dedicated tools for plugin management and multi-version packaging.',kind:'Tooling case study',challenge:'Plugin locations, dependencies, and engine versions affect different parts of development and release.',approach:'UEPluginManager handles discovery and dependencies. UEPluginAutoPacker brings together multi-version builds, logs, and package preparation. Each tool focuses on a separate stage.',outcome:'Two independently usable tools for management and packaging. See the products and guides for supported workflows.'}},
  {id:'markdown-publishing',productIds:['md-blog-packer'],
   zh:{title:'让 Markdown 图片随文章一起发布',summary:'从本地图片路径到可复制的发布文本，减少文章迁移时的手动整理。',kind:'工具实践',challenge:'本地 Markdown 能显示图片，复制到其他平台后，相对路径却未必可用。',approach:'MDBlogPacker 读取本地图片并转换为 Base64 内嵌格式，同时保留网络图片，支持标准图片语法与 Wiki 图片引用。',outcome:'提供 GUI 和命令行两种使用方式，转换结果可复制或导出；是否接受内嵌图片仍取决于目标平台。'},
   en:{title:'Publishing Markdown with its images',summary:'Turn local image references into portable publishing text.',kind:'Tooling case study',challenge:'Images that work in local Markdown may break when text is copied to a different platform.',approach:'MDBlogPacker embeds local images as Base64, preserves remote images, and supports standard Markdown and wiki image references.',outcome:'GUI and command-line workflows support copying or exporting the result. The destination platform still needs to accept embedded images.'}}
];

products.push(...[
  {
    "id": "ue-quick-start",
    "name": "UEQuickStart",
    "mark": "QS",
    "color": "blue",
    "category": "ue",
    "repo": "https://github.com/MZSH-Tools/UEQuickStart",
    "download": "https://github.com/MZSH-Tools/UEQuickStart/releases",
    "zh": {
      "label": "UE 编译与启动",
      "description": "检测项目与引擎，在图形界面中编译项目、查看日志并启动。",
      "features": [
        "检测项目与引擎",
        "编译前换行符修复",
        "实时日志与编译后启动"
      ],
      "steps": [
        "从仓库 Release 获取程序。",
        "按 README 准备项目环境并确认检测结果。",
        "执行编译，查看日志后启动项目。"
      ],
      "problem": "编译、日志检查和启动项目分散在多个操作入口。",
      "result": "将这些步骤集中到图形界面，方便重复运行。"
    },
    "en": {
      "label": "UE build & launch",
      "description": "Detect a project and engine, build with live logs, and launch from a graphical interface.",
      "features": [
        "Project and engine detection",
        "Line-ending repair before compilation",
        "Live logs and launch after building"
      ],
      "steps": [
        "Get the program from repository releases.",
        "Prepare the project environment following the README and check detection results.",
        "Build, inspect the logs, and launch the project."
      ],
      "problem": "Building, checking logs, and launching a project involve several separate steps.",
      "result": "A graphical interface brings those steps into a repeatable workflow."
    }
  },
  {
    "id": "p4-case-sync",
    "name": "P4CaseSync",
    "mark": "P4",
    "color": "violet",
    "category": "development",
    "license": "MIT",
    "repo": "https://github.com/MZSH-Tools/P4CaseSync",
    "download": "https://github.com/MZSH-Tools/P4CaseSync/releases",
    "zh": {
      "label": "Perforce 路径大小写",
      "description": "检查 changelist 中的路径大小写，并按本地真实路径整理修正。",
      "features": [
        "扫描 changelist 文件",
        "按本地路径纠正或手动编辑",
        "执行移动并复核一致性"
      ],
      "steps": [
        "从 Release 获取工具，并按 README 配置 Perforce 环境。",
        "选择要检查的 changelist，核对建议的路径变化。",
        "确认目标路径后执行修正并复核。"
      ],
      "problem": "提交中的路径大小写可能与本地真实文件不一致。",
      "result": "集中检查并纠正路径，便于提交前复核。"
    },
    "en": {
      "label": "Perforce path casing",
      "description": "Inspect changelist path casing and align it with the actual local paths.",
      "features": [
        "Scan changelist files",
        "Correct paths or edit them manually",
        "Move files and verify consistency"
      ],
      "steps": [
        "Get the tool from releases and configure Perforce as described in the README.",
        "Choose a changelist and inspect the proposed path changes.",
        "Confirm the target paths, apply corrections, and review the result."
      ],
      "problem": "Paths in a changelist can differ in casing from the actual local files.",
      "result": "A focused workflow for inspecting and correcting paths before submission."
    }
  },
  {
    "id": "simple-file-updater",
    "name": "SimpleFileUpdater",
    "mark": "FU",
    "color": "teal",
    "category": "utility",
    "license": "MIT",
    "repo": "https://github.com/MZSH-Tools/SimpleFileUpdater",
    "download": "https://github.com/MZSH-Tools/SimpleFileUpdater/releases",
    "zh": {
      "label": "配置式文件更新",
      "description": "把本地文件路径与远程地址写入配置，批量更新所需文件。",
      "features": [
        "本地路径与 URL 映射",
        "自动创建目录与注释配置",
        "GUI 与命令行运行"
      ],
      "steps": [
        "从 Release 获取工具并阅读配置格式。",
        "配置可信的下载地址与目标文件路径。",
        "运行更新并检查目标文件。"
      ],
      "problem": "多个本地文件需要从各自的远程地址反复更新。",
      "result": "用一份映射配置集中管理重复下载与更新。"
    },
    "en": {
      "label": "Configured file updates",
      "description": "Map local files to remote URLs and update them in a batch.",
      "features": [
        "Local-path to URL mappings",
        "Directory creation and configuration comments",
        "GUI and command-line workflows"
      ],
      "steps": [
        "Get the tool from releases and read the configuration format.",
        "Configure trusted source URLs and target file paths.",
        "Run the update and inspect the target files."
      ],
      "problem": "Several local files need repeated updates from separate remote URLs.",
      "result": "A mapping configuration brings repeated downloads and updates together."
    }
  }
]);

# bot-template

### An Open-Source Discord Bot template, complete with database integration.

## Usage

First, clone the repository:

```bash
  git clone https://github.com/Conrad306/bot-template.git
```

Install dependencies, fill env see (.env.example) and update botconfig information

```bash
yarn install
```

### File Setup

The current file structure is as follows:

```
  project-root
    - src/
      - client/
        - events/
        - buttons/
        - slashCommands/
        - autoCompletes/
        - selectMenus/

```

if you wish to change these, follow these steps:

- To add/remove folders between `src` and your interaction folders, edit the `load` function in `lib/common/loader/BaseInteractionLoader.ts` and the `loadEvents` function of `lib/common/ExtendedClient.ts`
- To change the title of a directory (e.g., "slashCommands" to "commands"), edit the string in the `load` function of `lib/common/loader/[FolderToReplace].ts` (for my earlier example, it would be `SlashCommandLoader.ts`)

###

Progress:

- [ ] Interaction handlers for every class
  - [x] Buttons
  - [x] Autocomplete
  - [ ] Modals
  - [ ] User Context
  - [ ] Message Context
  - [x] Select Menus
  - [x] Slash Commands
- [x] Message Commands
- [x] JSDoc
- [ ] Dockerize
- [ ] Strong-set permission system.

Planned Features:

- [ ] Support / development server linking, and channel logging on-error.
- [ ] Auto-paginated "help" command, which loads from `<Client>.slashCommands`
- [ ] Fastify connection for web data.
- [ ] Ratelimiting / Cooldowns.

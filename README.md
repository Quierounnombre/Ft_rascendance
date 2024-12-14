# ft_rascendance

## Collaborators

> - [Quierounnombre](https://github.com/Quierounnombre)
> - [ferri666](https://github.com/ferri666)
> - [hitchhikergalactic](https://github.com/hitchhikergalactic)
> - [pablo-is-a-goblin](https://github.com/pablo-is-a-goblin)
> - [witemirlo](https://github.com/witemirlo)

## workflow

> - Hay dos branches de git fijas, ***main*** y ***development***.
>   - ***main***: elementos finales/permanentes.
>   - ***development***: tareas completadas, pero pendientes de testeo y/o aprobación.
> - Para cada tarea se creara una **nueva branch** a partir de ***development***. Una vez terminada esta se pusheará a ***development***.
> - Las funcionalidades que se estimen finales se pushearan a ***main*** previo acuerdo de todos.

## git usage

> **See files with changes:**
>>
>> ```sh
>> git status
>> ```
>
> **See differences between last comit and local changes:**
>>
>>```sh
>> git diff
>> ```
>
> **Discard local changes:**
>>
>>```sh
>> git restore <file>
>> ```
>
> **Stash local changes:**
>>
>>```sh
>> git stash
>> ```
>
> **Unstash:**
>>
>>```sh
>> git stash pop
>> ```
>
> **Stage a file:**
>>
>>```sh
>> git add <file>
>> ```
>
> **Stage a file interactively:**
>>
>>```sh
>> git add -i
>> ```
>
> **Unstage a file:**
>>
>>```sh
>> git reset <file>
>> ```
>
> **Comit staged changes:**
>>
>>```sh
>> git commit -m "<commit message>"
>> ```
>
> **Push to remote:**
>>
>>```sh
>> git push
>> ```
>
> **Push and create new remote:**
>>
>>```sh
>> git push -u origin <new-branch-name>
>> ```
>
> **Change current branch:**
>>
>>```sh
>> git checkout <branch-name>
>> ```
>
> **Create new branch:**
>>
>>```sh
>> git checkout -b <new-branch-name>
>> ```
>
> **See commit summary:**
>>
>>```sh
>> git log
>> ````

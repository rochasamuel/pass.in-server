# pass.in

O pass.in é uma aplicação que foi implementada durante o evento NLW Unite da Rocketseat.

A idéia é que seja uma aplicação de **getsão de paticipantes em evento presenciais**

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para fazer o check-in no dia do evento.

O sitema fará um scan para verificar a credencial do participante a fim de permitir a entrada no evento.

## Requisitos

### Requisitos funcionais

- [x] O organizador deve poder cadastrar um novo evento;
- [x] O organizador deve poder visualizar dados de um evento;
- [x] O organizador deve poder visualizar a lista de participantes;
- [x] O participante deve poder se inscrever em um evento;
- [x] O participante deve poder visualizar seu crachá de inscrição;
- [x] O participante deve poder realizar check-in no evento;

### Regras de negócio

- [x] O participante só pode se inscrever em um evento de uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [x] O chek-in no evento só será realizado através de um QRCode

### Observações pessoais

- O sistema está estruturado de modo que o Participante está fortemente atrelado a um evento, ou seja,
no contexto do banco de dados, um _Attendee_ comporta no seu model o _eventId_ que ele está atrelado.
Se esse mesmo participante quiser se inscrever em outro evento um novo registro vai ser criado, com base
nesse novo _eventId_. Essa abordagem funciona bem para esse caso específico, em que não há login e etc. 
Numa abordagem em que o participante tem um login e tudo mais, creio que o ideal seria Uma tabela para 
_User_ outra para _Event_ e posteriormente um relacionamento vinculando os dois como por exemplo _Participation_.
Desse modo teriamos o checkin vinculado a esse relacionamento, e não uma tabela de _CheckIn_. 
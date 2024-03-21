<h1 align="center">Estudo de Clean Architecture</h1>

Esse projeto vai ser divido em branchs para cada etapa, onde no decorrer das etapas será implementado alguma melhoria grande

## branch etapa-1

Vamos implementar um sistema de vendas online com a possibilidade de realizar pedidos com múltiplos itens, cada um deles com uma quantidade variável, calculando o frete, os impostos, aplicando um cupom de desconto e ainda interagindo com o estoque. Além disso teremos ainda fluxos de pagamento e cancelamento do pedido realizado.

Para começar, faremos um projeto estruturado de forma simples, faça do jeito que você souber, depois vamos ir refatorando juntos.

#### Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total

#### Deve criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido)

#### Não deve criar um pedido com cpf inválido (lançar algum tipo de erro)

- Faça a modelagem da forma que desejar e não se preocupe por enquanto, vamos implementar juntos na aula seguinte com influências de DDD e Clean Architecture
- Utilize a sua linguagem e biblioteca de teste de sua preferência
- Devem existir no mínimo 2 arquivos, um de teste e outro que é a aplicação
- Como mecanismo de persistência você pode utilizar um banco de dados, um array em memória, um arquivo, qualquer coisa que desejar
- Como entrada você pode utilizar uma API HTTP, um CLI ou qualquer outro mecanismo que permita a entrada dos dados
- Tente seguir com disciplina, criando primeiro um teste que falha, depois fazendo e teste passar e refatorando

## branch etapa-2

Implementar um sistema de vendas online com a possibilidade de realizar pedidos com múltiplos itens, cada um deles com uma quantidade variável, calculando o frete, os impostos, aplicando um cupom de desconto e ainda interagindo com o estoque. Além disso teremos ainda fluxos de pagamento e cancelamento do pedido realizado.

Para começar, faça um projeto estruturado de forma simples, faça do jeito que você souber, que possa ser refatorado depois.

#### Não deve aplicar cupom de desconto expirado

#### Ao fazer um pedido, a quantidade de um item não pode ser negativa

#### Ao fazer um pedido, o mesmo item não pode ser informado mais de uma vez

#### Nenhuma dimensão do item pode ser negativa

#### O peso do item não pode ser negativo

#### Deve calcular o valor do frete com base nas dimensões (altura, largura e profundidade em cm) e o peso dos produtos (em kg)

#### Deve retornar o preço mínimo de frete caso ele seja superior ao valor calculado

- Faça a modelagem da forma que desejar e não se preocupe por enquanto, vamos implementar juntos na aula seguinte com influências de DDD e Clean Architecture
- Utilize a sua linguagem e biblioteca de teste de sua preferência
- Devem existir no mínimo 2 arquivos, um de teste e outro que é a aplicação
- Como mecanismo de persistência você pode utilizar um banco de dados, um array em memória, um arquivo, qualquer coisa que desejar
- Como entrada você pode utilizar uma API HTTP, um CLI ou qualquer outro mecanismo que permita a entrada dos dados
- Tente seguir com disciplina, criando primeiro um teste que falha, depois fazendo e teste passar e refatorando

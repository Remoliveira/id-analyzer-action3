# import mysql.connector
import csv
import re
import pandas as pd
pd.options.display.max_rows = 9999

# identificadoresCsv = pd.read_csv('../../../Identifiers.csv')
identificadoresCsv = pd.read_csv('Identifiers.csv')


def camelSplit(identifier):
    matches = re.finditer(
        '.+?(?:(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|$|_)', identifier)
    return [m.group(0).replace("_", "") for m in matches]


with open('IdentificadoresPosProcessamentoDeCategorira.csv', mode='a') as csv_file:
    fieldnames = ['Identificador', 'Tipo',
                  'Categoria', 'Posicao', 'Projeto']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    for row in identificadoresCsv.iterrows():
        # print(row)
        csvEntries = row[1]

        nomeIdentificador = csvEntries.nome
        # print(nomeIdentificador)
        tipo = csvEntries.tipo
        posicao = csvEntries.posicao

        idSplit = camelSplit(nomeIdentificador)
        tipoSplit = camelSplit(tipo)

        categoria = 0

        if(posicao == None):
            posicao = "Nulo"

            # 0 - Id que nao se encaixa
            # 1 - Número final
            # 2 - Número meio
            # 3 - Id igual ao tipo
            # 4 - Id de uma letra
            # 5 - Tem o tipo no meio do id
            # 6 - Id camel case 2 partes
            # 7 - Id camel case 3+
            # 8 - Id separado por underscore
            # 9 - Id iniciado por underscore
            # 10 - Id somente uma palavra

        if(re.search("[a-zA-Z]", nomeIdentificador) and len(idSplit) == 2):
            # print(nomeIdentificador)
            # categoria = 6
            if(re.search("_+", nomeIdentificador)):
                # print(nomeIdentificador)
                categoria = 8
            else:
                # print(nomeIdentificador)
                categoria = 6

        elif(re.search("[a-zA-Z]", nomeIdentificador) and len(idSplit) >= 3):
            # print(nomeIdentificador)
            categoria = 7
            if(re.search("_+", nomeIdentificador)):
                # print(nomeIdentificador)
                categoria = 8
            else:
                # print(nomeIdentificador)
                categoria = 7

        elif(len(idSplit) == 1):
            # print(nomeIdentificador)
            categoria = 10

        if(re.search("\d$", nomeIdentificador)):
            # print("id com numero no final: ",nomeIdentificador)
            categoria = 1

        elif(re.search("\d[a-zA-Z]$", nomeIdentificador)):
            # print("id com numero no meio: ",nomeIdentificador)
            categoria = 2

        elif(len(nomeIdentificador) == 1):
            # print("id uma letra: "nomeIdentificador)
            categoria = 4

        elif(re.search("^_\w", nomeIdentificador) and len(idSplit) == 1):
            # print(nomeIdentificador)
            categoria = 9

        elif(nomeIdentificador.casefold() == tipo.casefold()):
            # print("id == tipo ", nomeIdentificador, "--", tipo)
            categoria = 3

        else:
            # print("id com nome do tipo no meio: ",nomeIdentificador,"--",tipo)
            # contem = False
            for idUnico in idSplit:
                for tipoUnico in tipoSplit:

                    if(idUnico == tipoUnico):

                        categoria = 5
                        # print(nomeIdentificador,"-----",tipo)

        writer.writerow({'Identificador': nomeIdentificador, 'Tipo': tipo,
                        'Categoria': categoria, 'Posicao': posicao, 'Projeto': 'projeto'})

        categoria = 0

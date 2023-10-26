/* eslint-disable no-console */
/* eslint-disable filenames/match-regex */
import { PythonShell } from 'python-shell'
import csv2json from 'csvtojson'

class AlgorithmsService {
  async downloadDependencies(): Promise<void> {
    var packages = ['pandas', 'gensim.downloader']
    // var package_name = 'pandas'
    let options = {
      args: packages
    }

    return new Promise(async response => {
      setTimeout(() => {
        PythonShell.run('src/algorithms/install_package.py', options).then(
          messages => {
            console.log(messages, ' download dependencies finished')
          }
        )

        response()
      }, 2000)
    })
  }

  async applyCategoryAlgorithm(): Promise<void> {
    return new Promise(async response => {
      setTimeout(() => {
        PythonShell.run(
          'src/algorithms/categoriesAlgorithm/CategoryCatch.py'
        ).then(messages => {
          console.log(messages, ' apply categories finished')
        })

        response()
      }, 2000)
    })
  }

  async applyWordEmbeddingAlgorithm(): Promise<void> {
    return new Promise(async response => {
      setTimeout(() => {
        PythonShell.run(
          'src/algorithms/wordEmbeddingAlgorithms/fasttext2vec.py'
        ).then(messages => {
          console.log(messages, ' apply word embedding finished')
        })

        response()
      }, 2000)
    })
  }

  async setCategoryJson() {
    const categoryCsv = 'IdentificadoresPosProcessamentoDeCategorira.csv'
    const jsonArray = await csv2json().fromFile(categoryCsv)

    return jsonArray
  }

  async setPhoneticJson() {
    const phoneticCsv = 'wcmSeparetedMean.csv'
    const jsonArray = await csv2json().fromFile(phoneticCsv)

    return jsonArray
  }
}

export { AlgorithmsService }

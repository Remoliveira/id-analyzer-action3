/* eslint-disable no-console */
/* eslint-disable filenames/match-regex */
import { PythonShell } from 'python-shell'
import csv2json from 'csvtojson'
import { exec } from 'child_process'

class AlgorithmsService {
  async downloadDependencies(tag: string): Promise<void> {
    var packages = ['pandas', 'gensim.downloader']
    // var package_name = 'pandas'
    let options = {
      args: packages
    }

    return new Promise(async response => {
      setTimeout(() => {
        PythonShell.run(
          `/home/runner/work/_actions/Remoliveira/id-analyzer-action3/${tag}/dist/install_package.py`,
          options
        ).then(messages => {
          console.log(messages, ' download dependencies finished')
        })

        response()
      }, 2000)
    })
  }

  async applyCategoryAlgorithm(tag: string): Promise<void> {
    return new Promise(async response => {
      // setTimeout(() => {
      //   PythonShell.run(
      //     `/home/runner/work/_actions/Remoliveira/id-analyzer-action3/${tag}/dist/algorithms/CategoryCatch.py`
      //   ).then(messages => {
      //     console.log(messages, ' apply categories finished')
      //   })

      //   response()
      // }, 2000)

      setTimeout(() => {
        exec('python dist/algorithms/CategoryCatch.py', error => {
          if (error) {
            console.log(error)
            process.exit(1)
          } else {
            console.log('Install pandas done')
          }
        })
        response()
      }, 1000)
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

//
//  codigoViewController.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 5/30/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import UIKit
import CoreData

class codigoViewController: UIViewController, UITextFieldDelegate, NSFetchedResultsControllerDelegate {

    @IBOutlet weak var codigotext: UITextField!
    @IBOutlet weak var contenedor: UIView!
    var fetchResultController : NSFetchedResultsController<MAula>!
    var aulas = [MAula]()
    

    
    //var fectchResultController: NSFetchedResultsController<MInstit>!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.contenedor.layer.cornerRadius = 15.0
        self.codigotext.layer.cornerRadius = 15.0
        self.codigotext.delegate = self
        
        
        NotificationCenter.default.addObserver(self, selector: #selector(teclado(notificacion:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(teclado(notificacion:)), name: UIResponder.keyboardWillHideNotification, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(teclado(notificacion:)), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)

        // Do any additional setup after loading the view.
    }
    
    @objc func teclado(notificacion: Notification)
    {
        guard let tecladoUp = (notificacion.userInfo![UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else { return  }
        
        if notificacion.name == UIResponder.keyboardWillShowNotification{
            
            self.view.frame.origin.y = -tecladoUp.height + 100
            
        }else{
            self.view.frame.origin.y = 0
        }
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        self.view.endEditing(true)
    }
    
    
    func comprobarExisteRegistros() -> Bool{
        
        let contexto = Conexion().contexto()
        let fetchRequest : NSFetchRequest<MAula> = MAula.fetchRequest()
        let orderByNombre = NSSortDescriptor(key: "name", ascending: true)
        fetchRequest.sortDescriptors = [orderByNombre]
        
        fetchResultController = NSFetchedResultsController(fetchRequest: fetchRequest, managedObjectContext: contexto, sectionNameKeyPath: nil, cacheName: nil)
        
        
        fetchResultController.delegate = self
        
        do{
            try fetchResultController.performFetch()
            aulas = fetchResultController.fetchedObjects!
            
            print("Cantidad de Aulas \(aulas.count)")
            
            if aulas.count > 0{
                return true
            }
        }catch let error as NSError{
            print("Hubo un error al mostrar los datos", error.localizedDescription)
        }
        
        return false
    }
    
    func buscarCodigo(codigo: String)
    {
        let contexto = Conexion().contexto()
        let fetchRequest : NSFetchRequest<MAula> = MAula.fetchRequest()
        let orderByNombre = NSSortDescriptor(key: "name", ascending: true)
        fetchRequest.sortDescriptors = [orderByNombre]
        fetchRequest.predicate = NSPredicate(format: "code == %@", codigo as CVarArg)
        
        fetchResultController = NSFetchedResultsController(fetchRequest: fetchRequest, managedObjectContext: contexto, sectionNameKeyPath: nil, cacheName: nil)
        
        fetchResultController.delegate = self
        
        do{
            try fetchResultController.performFetch()
            aulas = fetchResultController.fetchedObjects!
            
            print("Buscando Codigo")
            if aulas.count > 0{
                performSegue(withIdentifier: "autenticacion", sender: self)
            }else{
                let alert = UIAlertController(title: "Código Inválido", message: "Debe ingresar un código válido para continuar", preferredStyle: .alert)
                
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    self.codigotext.text = ""
                }))
                
                self.present(alert, animated: true, completion: nil)
            }
        }catch let error as NSError{
            print("Hubo un error al mostrar los datos", error.localizedDescription)
        }
    }
    
    @IBAction func insertarCodigo(_ sender: UITextField) {
        print("Codigo insertado \(sender.text!)")
    }
    
    
    func irAutenticacion()
    {
        let codigo = self.codigotext.text!
        let estado = comprobarExisteRegistros()
        
        if estado == true {
            
            if codigo != "" {
                buscarCodigo(codigo: codigo)
                //performSegue(withIdentifier: "autenticacion", sender: self)
            }else{
                
                let alert = UIAlertController(title: "Código Inválido", message: "Debe ingresar un código válido para continuar", preferredStyle: .alert)
                
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    self.codigotext.text = ""
                }))
                
                self.present(alert, animated: true, completion: nil)
            }
            
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == self.codigotext {
            textField.resignFirstResponder()
            print("aca llego")
            irAutenticacion()
            return false
        }
        print("aca no llego")
        return true
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier  == "autenticacion"{
            let destino = segue.destination as! AutenticacionViewController
            
            destino.codigoInstituto = self.codigotext.text!
        }
    }
    
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

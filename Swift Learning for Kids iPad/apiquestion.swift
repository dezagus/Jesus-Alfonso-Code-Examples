//
//  apiquestion.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 6/10/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import Foundation
import UIKit


struct APIOptions: Codable{
    let id: Int
    let description: String
    let correct: Bool
    let question: Int
    let photo: String
}

struct APIQuestion: Codable{
    let id: Int
    let description: String
    let options: [APIOptions]
    let active: Bool
    let max_point: String!
    let end_time: String!
    let photo: String!
    let type_question: Int
    let range_age: Int
}


struct APIStudent: Codable{
    let id: Int
    let photo: String
    let name: String
    let birth_date: String
}

struct APIAulas: Codable{
    let id: Int
    let code: String
    let active: Bool
    let name: String
    let students: [APIStudent]
}


struct APIInstitute: Codable{
    let id: Int
    let code: String
    let active: Bool
    let name: String
    let aulas: [APIAulas]
    
}

struct APITotal: Codable{
    let institutes: [APIInstitute]
    let questions: [APIQuestion]
}

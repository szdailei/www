export default `
type Query {
    getCourses: [String]    
    getCourse(name:String!): String
    getUsers: [String]
    getRoles: [String]
    getUserRoles: [String]
    getPermissions: [String]
    createUser(name:String, password:String):Boolean
    changePassword(name: String!, password:String!):Boolean
    getWebToken(name:String, password:String):String
    log(data:String): Boolean
    pdf(url:String!): String    
    sortAcceptLanguage: String
    resume(name: String): String
}

type Mutation {
    deleteUser(name: String!): Boolean
  }
`;

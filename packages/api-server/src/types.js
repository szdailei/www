export default `
type Query {
    getCourses: [String]    
    getCourse(name:String!): String
    getUsers: [String]
    getRoles: [String]
    getUserRoles: [String]
    getPermissions: [String]
    createUser(name:String, password:String):Boolean
    deleteUser(name:String): Boolean
    changePassword(name: String, password:String):Boolean
    getWebToken(name:String, password:String):String
    log(data:String): Boolean
    getResume: String
    getResumeImage: String
    getResumeWeChatImage: String
}
`;

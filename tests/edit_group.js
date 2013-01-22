/*
 * Copyright 2012 Sakai Foundation (SF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 * 
 *     http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var Group = require('../lib/api/group');
var User = require('../lib/api/user');

/**
 * Generate a user session against the runner that similuates an authenticated user editing group memberships
 *
 * @param {Tsung}   runner          The Tsung runner to build the session on
 * @param {Number}  probability     The probability that this session will execute
 */
module.exports.test = function(runner, probability) {
    probability = probability || 100;
    // Create a new session.
    var session = runner.addSession('edit_group', probability);

    var user = User.login(session, '%%_edit_group_managerid%%', '%%_edit_group_managerpass%%');

    // Adds a user to the group
    Group.addUser(session, {'%%_edit_group_nonmemberid%%': 'member'}, '%%_edit_group_groupid%%');

    session.think(4);

    // Removes a user from the group
    Group.addUser(session, {'%%_edit_group_memberid%%': false}, '%%_edit_group_groupid%%');

    // That's it for now
    User.logout(session);
};

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sources_path: {
            back_end: 'sources/back_end/',
            front_end: 'sources/front_end/'
        },
        dest_path: {
            front_end: '../../../components/com_tz_portfolio/'
        },
        cssmin: {
            back_end: {
                files: [{
                    expand: true,
                    cwd: '<%= sources_path.back_end %>css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            },
            back_end_jui:{
                files: {
                    'jui/css/chosen.min.css': '<%= sources_path.back_end %>jui/css/chosen.css',
                    'jui/css/icomoon.min.css': '<%= sources_path.back_end %>jui/css/icomoon.css',
                    'jui/css/sortablelist.min.css': '<%= sources_path.back_end %>jui/css/sortablelist.css'
                }
            },
            front_end: {
                options: {
                    expression: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= sources_path.front_end %>css',
                    src: ['*.min.css'],
                    dest: '<%= dest_path.front_end %>css'
                }]
            }
        },
        //'**/*.js'
        uglify: {
            back_end: {
                files: [{
                    expand: true,
                    cwd: '<%= sources_path.back_end %>js',
                    src: ['*.js'],
                    dest: 'js',
                    ext: '.min.js'
                }]
            },
            back_end_expression_js: {
                files: [{
                    expand: true,
                    cwd: '<%= sources_path.back_end %>js',
                    src: ['*.min.js'],
                    dest: 'js'
                }],
                options: {
                    compress: {
                        drop_console: true
                    },
                    expression: false,
                    mangle: false,
                    preserveComments: 'some'
                }
            },
            front_end:{
                files: [{
                    '<%= dest_path.front_end %>js/base64.min.js': '<%= sources_path.front_end %>js/base64.js',
                    '<%= dest_path.front_end %>js/blog.min.js': '<%= sources_path.front_end %>js/blog.js',
                    '<%= dest_path.front_end %>js/jquery.kinetic.min.js': '<%= sources_path.front_end %>js/jquery.kinetic.js',
                    '<%= dest_path.front_end %>js/jquery.selectbox-0.5.min.js': '<%= sources_path.front_end %>js/jquery.selectbox-0.5.js',
                    '<%= dest_path.front_end %>js/jquery-1.9.1.min.js': '<%= sources_path.front_end %>js/jquery-1.9.1.js',
                    '<%= dest_path.front_end %>js/jquery-noconflict.min.js': '<%= sources_path.front_end %>js/jquery-noconflict.js',
                    '<%= dest_path.front_end %>js/modernizr.custom.11333.min.js': '<%= sources_path.front_end %>js/modernizr.custom.11333.js',
                    '<%= dest_path.front_end %>js/tz_portfolio.min.js': '<%= sources_path.front_end %>js/tz_portfolio.js'
                }]
            },
            front_end_expression_js: {
                options: {
                    expression: true,
                    mangle: false,
                    compress: true,
                    preserveComments: 'all'
                },
                files: [{
                    expand: true,
                    cwd: '<%= sources_path.front_end %>js/libraries',
                    src: ['*.js'],
                    dest: '<%= dest_path.front_end %>js'
                }]
            }
        },
        less: {
            development: {
                options: {
                    ieCompat: false,
                    compress: true
                },
                files: {
                    "<%= dest_path.front_end %>css/portfolio_gallery.min.css": "<%= sources_path.front_end %>less/portfolio_gallery.less",
                    "<%= dest_path.front_end %>css/timeline_classic.min.css": "<%= sources_path.front_end %>less/timeline_classic.less",
                    "<%= dest_path.front_end %>css/tz.bootstrap.min.css": "<%= sources_path.front_end %>less/tz.bootstrap.less",
                    "<%= dest_path.front_end %>css/flexslider.min.css": "<%= sources_path.front_end %>less/flexslider.less",
                    "<%= dest_path.front_end %>css/tzportfolio.min.css": "<%= sources_path.front_end %>less/tzportfolio.less"
                }
            }
        },
        copy: {
            back_end: {
                files: [
                    {src: '<%= sources_path.back_end %>js/jquery-ui.min.js', dest:'js/jquery-ui.min.js'}
                ]
            },
            front_end:{
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd:'<%= sources_path.front_end %>js/libraries',
                        src: ['*.js'],
                        dest: '<%= dest_path.front_end %>js/',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('back_end', ['uglify:back_end','uglify:back_end_expression_js',
        'cssmin:back_end','cssmin:back_end_jui','copy:back_end']);
    grunt.registerTask('front_end', ['uglify:front_end','uglify:front_end','copy:front_end','less','cssmin:front_end']);
    grunt.registerTask('default', ['back_end','front_end']);
};